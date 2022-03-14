import React, { useContext, useEffect, useRef, useState } from 'react';
import { Alert, Animated, Image, Text, View } from 'react-native';
import { AuthenticatedUserContext } from '../providers/AuthenticatedUserProvider';
import { db } from '../config/firebase';
import {
    addDoc,
    arrayUnion,
    collection,
    doc,
    getDocs,
    query,
    updateDoc,
    where,
} from 'firebase/firestore';
import CustomDropDown from './CustomDropDown';
import { dateRange, dateToString } from '../utils/GlobalFuncitions';
import { myOrdersContext } from '../providers/MyOrdersProvider';
import { Divider } from 'react-native-elements';
import CustomButton from './CustomButton';

export default function MaxiCard({
    navigation,
    address,
    timeSlots,
    price,
    image,
    id,
    style,
    phone,
    owner_id,
}) {
    const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
    const [selectedDateRange, setSelectedDateRange] = useState([]);
    const [selectedStart, setSelectedStart] = useState(null);
    const [selectedEnd, setSelectedEnd] = useState(null);
    const { myOrders } = useContext(myOrdersContext);
    const [relatedOrders, setRelatedOrders] = useState([]);

    useEffect(() => {
        setSelectedStart(null);
        setSelectedEnd(null);
        if (selectedTimeSlot) {
            setSelectedDateRange(
                dateRange(
                    selectedTimeSlot.start.toDate(),
                    selectedTimeSlot.end.toDate(),
                    15
                ).filter(
                    (dateItem) =>
                        !relatedOrders.some(
                            ({ start, end }) =>
                                start <= dateItem && end > dateItem
                        )
                )
            );
        }
    }, [selectedTimeSlot]);

    useEffect(() => {
        setSelectedDateRange(
            selectedDateRange.filter(
                (dateItem) =>
                    !relatedOrders.some(
                        ({ start, end }) =>
                            // selected start is between old reservation slot
                            (start <= selectedStart && end > selectedStart) ||
                            // OR: date resembles wrapping slot encapsulating old timeslot already ordered by user
                            (start >= selectedStart && dateItem >= end)
                    )
            )
        );
    }, [selectedStart]);

    useEffect(() => {
        const q = query(
            collection(db, 'orders'),
            where('station_id', '==', id)
        );
        getDocs(q).then((snap) => {
            setRelatedOrders(
                snap.docs.map((order) => ({
                    start: order.data().reservation.date_start.toDate(),
                    end: order.data().reservation.date_finish.toDate(),
                }))
            );
        });
    }, [myOrders]);

    return (
        <View style={style}>
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                }}
            >
                <Text
                    style={{
                        flexWrap: 'wrap',
                        color: 'black',
                        fontWeight: 'bold',
                    }}
                >
                    {address}
                </Text>
                <Text>
                    {phone} {price} nis
                </Text>
            </View>
            <Divider style={{ margin: 10 }} />
            <Image
                source={
                    image
                        ? { uri: image }
                        : require('../assets/defaults/default_image.png')
                }
                style={{
                    width: 250,
                    height: 150,
                    alignSelf: 'center',
                    borderRadius: 15,
                    margin: 10,
                }}
            />

            <View style={{ alignItems: 'center' }}>
                <CustomButton
                    text={'Order'}
                    onPress={() =>
                        navigation.push('OrderStack', {
                            address,
                            timeSlots,
                            price,
                            image,
                            id,
                            phone,
                            owner_id,
                        })
                    }
                    // disabled={!(selectedStart && selectedEnd)}
                    // processing={processing}
                />
            </View>
        </View>
    );
}
