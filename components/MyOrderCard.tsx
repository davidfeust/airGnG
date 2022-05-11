import React, { useContext, useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { globalStyles } from '../assets/styles/globalStyles';
import { dateToString, onCall } from '../utils/GlobalFuncitions';
import { colors } from '../assets/styles/colors';
import { Card } from 'react-native-elements';
import { arrayUnion, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import TimeSlot from './TimeSlot';
import { AuthenticatedUserContext } from '../providers/AuthenticatedUserProvider';
import CustomRating from "./CustomRating";


export default function MyOrderCard({
    order_date,
    payed,
    reservation, // = { start_date:{firebase date type...} , finish_date:{firebase date type...}}
    station_id,
    sub_car_type,
    sub_id,
    order_id,
    onCancel,
}) {
    //the order user details
    const { user } = useContext(AuthenticatedUserContext);

    // stores the order's station details
    const [stationOrdered, setStationOrdered] = useState(null);

    // stores the order's owner details
    const [stationOwner, setStationOwner] = useState(null);
    const ordersRecievedFromFirebase = useRef<boolean>(false);

    // stores th owners rating
    const [ownerRating, setOwnerRating] = useState(0);

    useEffect(() => {
        // update station details from db
        getDoc(doc(db, 'stations', station_id)).then(
            (d) =>
                !ordersRecievedFromFirebase.current &&
                setStationOrdered(d.data())
        );
        // return callback to cancel the async task. see an example here:
        // https://stackoverflow.com/questions/56450975/to-fix-cancel-all-subscriptions-and-asynchronous-tasks-in-a-useeffect-cleanup-f
        return () => {
            ordersRecievedFromFirebase.current = true;
        };
    }, []);

    useEffect(() => {
        // update owner details from db
        stationOrdered &&
            getDoc(doc(db, 'users', stationOrdered.owner_id)).then((d) => {
                setStationOwner(d.data());
            });
    }, [stationOrdered]);

    const onReview = async (rating, comment) => {
        const review = {
            rating,
            comment,
            reviewer: user.name,
        };
        await updateDoc(doc(db, 'users', stationOrdered.owner_id), {
            reviews: arrayUnion(review),
        });
    };
    console.log("date: "+order_date);

    return (
        <View>
            {stationOrdered && stationOwner && (
                <Card containerStyle={{ borderRadius: 15 }}>
                    {/* address */}
                    <Card.Title>address: {stationOrdered.address}</Card.Title>
                    {/* order date */}
                    <Card.Title>
                        
                       { `oredered on: ${dateToString(order_date.toDate())}`}
                    </Card.Title>
                    <View
                        style={{
                            flex: 1,
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                        }}
                    >
                        {/* owner name if exists... */}
                        {stationOwner.name && (
                            <View>
                                <Card.Title>
                                    owner: {stationOwner.name}
                                </Card.Title>
                                <CustomRating
                                    ratingProps={{
                                        defaultRating: ownerRating,
                                        size: 15,
                                    }}
                                    onReview={onReview}
                                />
                            </View>
                        )}
                        {/* the order user name if exists... */}
                        {user.name && (
                            <View>
                                <Card.Title>ordered by: {user.name}</Card.Title>
                                <CustomRating
                                onReview={{}}
                                    ratingProps={{
                                        size: 15,
                                        defaultRating: user.rating,
                                        isDisabled: true,
                                    }}
                                />
                            </View>
                        )}
                    </View>

                    <Card.Divider orientation='horizontal' />

                    {/* reservation details */}
                    <TimeSlot
                        start={reservation.date_start.toDate()}
                        end={reservation.date_finish.toDate()}
                    />

                    {/* is it payed already? */}
                    <Text>payed: {String(payed)}</Text>

                    {/* calculated price */}
                    <Text>
                        price:{' '}
                        {((reservation.date_finish.toDate() -
                            reservation.date_start.toDate()) /
                            36e5) *
                            stationOrdered.price}{' '}
                        nis
                    </Text>

                    {/* car type. we might erase this field in the future */}
                    <Text>car type: {sub_car_type}</Text>

                    {/* image */}
                    {stationOrdered.image !== undefined && (
                        <Card.Image source={{ uri: stationOrdered.image }} />
                    )}

                    {/* buttons */}
                    <View style={globalStyles.flex_container}>
                        {/* CANCEL */}
                        {onCancel && (
                            <TouchableOpacity
                                style={styles.icon}
                                onPress={() => onCancel(order_id)}
                            >
                                <MaterialCommunityIcons
                                    name='trash-can'
                                    size={30}
                                    color={colors.primary}
                                />
                                <Text style={styles.explain}>Cancel Order</Text>
                            </TouchableOpacity>
                        )}

                        {/* PHONE button to call the station owner */}
                        {stationOwner.phone ? (
                            <TouchableOpacity
                                style={styles.icon}
                                onPress={() => onCall(stationOwner.phone)}
                            >
                                <MaterialCommunityIcons
                                    name='phone'
                                    size={30}
                                    color={colors.primary}
                                />
                                <Text style={styles.explain}>
                                    call the owner
                                </Text>
                            </TouchableOpacity>
                        ) : null}
                    </View>
                </Card>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    icon: {
        margin: 15,
        alignItems: 'center',
    },
    explain: {
        marginTop: 3,
        width: 70,
        textAlign: 'center',
    },
});
