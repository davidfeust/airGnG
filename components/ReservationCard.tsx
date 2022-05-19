import { MaterialCommunityIcons } from '@expo/vector-icons';
import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Card } from 'react-native-elements';
import { Order } from '../App.d';
import { colors } from '../assets/styles/colors';
import { globalStyles } from '../assets/styles/globalStyles';
import { db } from '../config/firebase';
import { dateToString, onCall } from '../utils/GlobalFuncitions';
import CustomRating from './CustomRating';
import TimeSlot from './TimeSlot';

export default function ReservationCard({
    order,
    onCancel,
}: {
    order: Order;
    onCancel?: (order_id: string) => void;
}) {
    // stores the order's station details
    const [stationOrdered, setStationOrdered] = useState(null);

    // stores the order's sub details
    const [subDetails, setSubDetails] = useState(null);
    const [subRating, setSubRating] = useState(0);

    useEffect(() => {
        // update station details from db
        getDoc(doc(db, 'stations', order.station_id)).then((d) =>
            setStationOrdered(d.data())
        );
    }, []);

    useEffect(() => {
        // update owner details from db
        getDoc(doc(db, 'users', order.user_id)).then((d) => {
            setSubDetails(d.data());
        });
    }, []);
    useEffect(() => {
        const reviews = subDetails.reviews;
        if (reviews) {
            let sum = 0;
            reviews.forEach((reaview) => (sum += reaview.rating));
            const rating = sum / reviews.length;
            setSubRating(rating);
        }
    },[]);

    return (
        <View>
            {stationOrdered && subDetails && (
                <Card
                    containerStyle={{
                        borderRadius: 15,
                        flex: 1,
                    }}
                >
                    {/* order date */}
                    <Card.Title>
                        ordered on: {dateToString(order.order_date.toDate())}
                    </Card.Title>
                    <View>
                        {/* the order user name if exists... */}
                        {subDetails.name && (
                            <Card.Title>
                                ordered by: {subDetails.name}
                            </Card.Title>
                        )}
                        <View>
                            <CustomRating
                                ratingProps={{
                                    isDisabled: true,
                                    defaultRating: subRating,
                                    size: 15,
                                }}
                            />
                        </View>
                    </View>

                    <Card.Divider orientation='horizontal' />

                    {/* reservation details */}
                    <TimeSlot
                        start={order.reservation.date_start.toDate()}
                        end={order.reservation.date_finish.toDate()}
                    />

                    {/* is it Paid already? */}
                    <Text>{`Paid: ${String(order.paid)}`}</Text>

                    {/* calculated price */}
                    <Text>
                        price:{' '}
                        {((order.reservation.date_finish.toDate().getTime() -
                            order.reservation.date_start.toDate().getTime()) /
                            36e5) *
                            stationOrdered.price}{' '}
                        nis
                    </Text>

                    {/*TODO: the 'Reservation man' image, */}

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
