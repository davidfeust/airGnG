import { Text, View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { colors } from '../assets/styles/colors';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import TimeSlot from '../components/TimeSlot';
import moment from 'moment';
import CustomDateRangePicker from '../components/CustomDateRangePicker';

const OrderScreen = ({
    route: {
        params: { address, timeSlots, price, image, id, phone, owner_id },
    },
}) => {
    const [ownerDetails, setOwnerDetails] = useState(null);
    const [selectedSlotIdx, setSelectedSlotIdx] = useState(-1);
    const [chosenStart, setChosenStart] = useState(null);
    const [chosenEnd, setChosenEnd] = useState(null);
    const [show, setShow] = useState(moment());

    useEffect(async () => {
        const ownerRef = doc(db, 'users', owner_id);
        const ownerObject = await getDoc(ownerRef);
        setOwnerDetails(ownerObject.data());
    }, [owner_id]);

    const onSelectSlot = (idx) => {
        selectedSlotIdx === idx
            ? setSelectedSlotIdx(-1)
            : setSelectedSlotIdx(idx);
    };

    return (
        <View
            style={{
                alignItems: 'center',
            }}
        >
            <View style={styles.station_details}>
                <Image source={{ uri: image }} style={styles.image} />
                <View style={styles.text}>
                    <Text style={styles.address_text}>{address}</Text>
                    {ownerDetails && (
                        <Text style={styles.owner_text}>
                            {'Owner: ' + ownerDetails.name}
                        </Text>
                    )}
                </View>
            </View>

            {timeSlots.map(({ start, end }, idx) => {
                const minDate = start.toDate();
                const maxDate = end.toDate();
                return (
                    <CustomDateRangePicker
                        minDate={minDate}
                        maxDate={maxDate}
                        setStart={setChosenStart}
                        setEnd={setChosenEnd}
                    />
                );
            })}
        </View>
    );
};

export default OrderScreen;

const styles = StyleSheet.create({
    station_details: {
        backgroundColor: '#fff',
        width: '90%',
        top: 40,
        flexDirection: 'row',
        borderRadius: 15,
        overflow: 'hidden',
        elevation: 5,
        marginBottom: 40,
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
    owner_text: {
        maxWidth: '95%',
        color: colors.primary,
        fontSize: 18,
        fontWeight: 'bold',
    },
    num_text: {
        maxWidth: '95%',
        color: colors.primary,
        fontSize: 15,
    },
    timeSlotContainer: {
        // marginVertical: 20,
        // paddingHorizontal: 40,
        // width: '100%',
    },
});
