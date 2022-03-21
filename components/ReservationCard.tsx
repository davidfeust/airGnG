import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { globalStyles } from '../assets/styles/globalStyles';
import { dateToString, onCall } from '../utils/GlobalFuncitions';
import { colors } from '../assets/styles/colors';
import { Card } from 'react-native-elements';
import { doc, getDoc, Timestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import TimeSlot from './TimeSlot';
import { Reservation, PlugType } from '../App.d';

export default function ReservationCard({
    date_of_sub,
    payed,
    reservation,
    station_id,
    sub_car_type,
    sub_id,
    order_id,
    onCancel,
}: {
    date_of_sub: Timestamp;
    payed: boolean;
    reservation: Reservation;
    station_id: string;
    sub_car_type: PlugType;
    sub_id: string;
    order_id: string;
    onCancel?: (order_id: string) => void;
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
        getDoc(doc(db, 'users', sub_id)).then((d) => {
            setSubDetails(d.data());
        });
    }, []);
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
                        ordered on: {dateToString(date_of_sub.toDate())}
                    </Card.Title>
                    <View>
                        {/* the order user name if exists... */}
                        {subDetails.name && (
                            <Card.Title>
                                ordered by: {subDetails.name}
                            </Card.Title>
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
                        {((reservation.date_finish.toDate().getTime() -
                            reservation.date_start.toDate().getTime()) /
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
