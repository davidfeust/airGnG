import React, { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import ReservationCard from '../components/ReservationCard';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../config/firebase';
import { globalStyles } from '../assets/styles/globalStyles';
import { colors } from '../assets/styles/colors';

export default function ReservationFromMeScreen({
    route: {
        params: { station_image, station_address },
    },
}) {
    const [reservations, setReservations] = useState([]);

    useEffect(() => {
        const res = query(
            collection(db, 'orders'),
            where('station_id', '==', route.params.station_id)
        );
        getDocs(res).then((snap) => {
            setReservations(snap.docs.map((d) => ({ ...d.data(), id: d.id })));
        });
    }, [reservations]);

    return (
        <View style={{ alignItems: 'center' }}>
            <View style={styles.station_details}>
                <Image source={{ uri: station_image }} style={styles.image} />
                <View style={styles.text}>
                    <Text style={styles.address_text}>{station_address}</Text>
                    <Text style={styles.num_text}>
                        Number of orders: {reservations.length}
                    </Text>
                </View>
            </View>

            <View style={{ marginTop: 160, alignItems: 'center' }}>
                {reservations.length > 0 ? (
                    <ScrollView>
                        {reservations.map(
                            ({
                                date_of_sub,
                                payed,
                                reservation,
                                station_id,
                                sub_car_type,
                                sub_id,
                                id,
                            }) => (
                                <ReservationCard
                                    date_of_sub={date_of_sub}
                                    payed={payed}
                                    reservation={reservation}
                                    station_id={station_id}
                                    sub_car_type={sub_car_type}
                                    sub_id={sub_id}
                                    order_id={id}
                                    // onCancel={onCancel}
                                    key={id}
                                />
                            )
                        )}
                    </ScrollView>
                ) : (
                    <Text style={[globalStyles.subTitle, { marginTop: 150 }]}>
                        You don't have any orders yet...
                    </Text>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    station_details: {
        backgroundColor: '#fff',
        width: '90%',
        position: 'absolute',
        top: 40,
        flexDirection: 'row',
        borderRadius: 15,
        overflow: 'hidden',
        elevation: 5,
    },
    image: {
        width: 400 * 0.4,
        height: 300 * 0.4,
        alignItems: 'center',
    },
    text: {
        marginStart: 10,
        marginVertical: 20,
        justifyContent: 'space-between',
    },
    address_text: {
        maxWidth: '95%',
        color: colors.primary,
        fontSize: 16,
        fontWeight: 'bold',
    },
    num_text: {
        maxWidth: '95%',
        color: colors.primary,
        fontSize: 15,
    },
});
