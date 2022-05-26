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
import CustomRating from './CustomRating';
import * as Server from '../utils/ServerInterface';
import { Order } from '../App.d';
import { observer } from '../App';

export default function MyOrderCard({
    order,
    onCancel,
}: {
    order: Order;
    onCancel(orderId: string): void;
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
        Server.getOneStation(order.station_id).then((d) => {
            !ordersRecievedFromFirebase.current && setStationOrdered(d);
        });
        // return callback to cancel the async task. see an example here:
        // https://stackoverflow.com/questions/56450975/to-fix-cancel-all-subscriptions-and-asynchronous-tasks-in-a-useeffect-cleanup-f
        return () => {
            ordersRecievedFromFirebase.current = true;
        };
    }, []);

    useEffect(() => {
        // update owner details from db
        stationOrdered &&
            Server.getOneUser(stationOrdered.owner_id).then((d) => {
                setStationOwner(d);
            });
    }, [stationOrdered]);

    const onReview = async (rating: number, comment: string) => {
        const review = {
            rating,
            comment,
            reviewer: user.name,
        };
        await updateDoc(doc(db, 'users', stationOrdered.owner_id), {
            reviews: arrayUnion(review),
        });
    };

    return (
        <View>
            {stationOrdered && stationOwner && (
                <Card containerStyle={{ borderRadius: 15 }}>
                    {/* address */}
                    <Card.Title>address: {stationOrdered.address}</Card.Title>
                    {/* order date */}
                    <Card.Title>
                        oredered on: {dateToString(order.order_date.toDate())}
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
                        start={order.reservation.date_start.toDate()}
                        end={order.reservation.date_finish.toDate()}
                    />

                    {/* is it Paid already? */}
                    {order.paid ? (
                        <Text>{'Reservation Confirmed'}</Text>
                    ) : (
                        <Text>{'Wating For Confirmation'}</Text>
                    )}

                    {/* calculated price */}
                    <Text>
                        price:{' '}
                        {((order.reservation.date_finish.toDate().getTime() -
                            order.reservation.date_start.toDate().getTime()) /
                            36e5) *
                            stationOrdered.price}{' '}
                        nis
                    </Text>

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
                                onPress={() => onCancel(order.id)}
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
