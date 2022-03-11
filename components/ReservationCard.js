import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { globalStyles } from '../assets/styles/globalStyles';
import { dateToString, onCall } from '../utils/GlobalFuncitions';
import { colors } from '../assets/styles/colors';
import { Card } from 'react-native-elements';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import TimeSlot from './TimeSlot';
import CustomRating from './CustomRating';

export default function ReservationCard({
    date_of_sub,
    payed,
    reservation, // = { start_date:{firebase date type...} , finish_date:{firebase date type...}}
    station_id,
    sub_car_type,
    sub_id,
    order_id,
    onCancel,
}) {
    // stores the order's station details
    const [stationOrdered, setStationOrdered] = useState(null);

    // stores the order's sub details
    const [subDetails, setSubDetails] = useState(null);

    useEffect(() => {
        // update station details from db
        getDoc(doc(db, 'stations', station_id)).then((d) =>
            setStationOrdered(d.data())
        );
    }, []);

    useEffect(() => {
        // update owner details from db
        getDoc(doc(db, 'users', sub_id)).then((subDoc) => {
            const subData = subDoc.data();
            const reviews = subData.reviews;
            let rating = 0;
            if (reviews) {
                let sum = 0;
                reviews.forEach((reaview) => (sum += reaview.rating));
            }
            setSubDetails({ ...subData, rating });
        });
    }, []);

    return (
        <View>
            {stationOrdered && subDetails && (
                <Card containerStyle={{ borderRadius: 15 }}>
                    {/* order date */}
                    <Card.Title>
                        ordered on: {dateToString(date_of_sub.toDate())}
                    </Card.Title>
                    <View
                        style={{
                            flex: 1,
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                        }}
                    >
                        {/* the order user name if exists... */}
                        {subDetails.name && (
                            <View>
                                <Card.Title>
                                    ordered by: {subDetails.name}
                                </Card.Title>
                            </View>
                        )}
                        <View>
                            <CustomRating
                                ratingProps={{
                                    isDisabled: true,
                                    defaultRating: subDetails.rating,
                                    size: 15,
                                }}
                            />
                        </View>
                    </View>

                    <Card.Divider orientation='horizontal' />

                    {/* reservation details */}
                    <TimeSlot
                        start={reservation.date_start.toDate()}
                        end={reservation.date_finish.toDate()}
                        index={0}
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

                    {/*TODO: the 'Reservation man' image, */}
                    {/*stationOrdered.image !== undefined && (
                        <Card.Image source={{uri: stationOrdered.image}}/>
                    )*/}

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
                        {subDetails.phone ? (
                            <TouchableOpacity
                                style={styles.icon}
                                onPress={() => onCall(subDetails.phone)}
                            >
                                <MaterialCommunityIcons
                                    name='phone'
                                    size={30}
                                    color={colors.primary}
                                />
                                <Text style={styles.explain}>
                                    call {subDetails.name}
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
