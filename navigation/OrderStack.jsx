import { Text, View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { colors } from '../assets/styles/colors';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import TimeSlot from '../components/TimeSlot';
import moment from 'moment';
import CustomDateRangePicker from '../components/CustomDateRangePicker';
import { createStackNavigator } from '@react-navigation/stack';
import { globalStyles } from '../assets/styles/globalStyles';
import { Divider } from 'react-native-elements/dist/divider/Divider';
import CustomButton from '../components/CustomButton';
import PaymentPage from '../pages/PaymentPage';
import MiniCard from '../components/MiniCard';

const ChooseTimeSlot = ({ route, navigation }) => {
    return (
        <View style={{ alignSelf: 'center' }}>
            <Text style={globalStyles.title}>Creating Your Order</Text>
            <Divider />
            <Text style={globalStyles.subTitle}>
                Lets start with Choosing your Slot
            </Text>
            {route.params.timeSlots.map((slot, idx) => {
                const { start, end } = slot;
                const s = start.toDate();
                const e = end.toDate();
                return (
                    <TouchableOpacity
                        key={idx}
                        onPress={() =>
                            navigation.navigate('Choose Time', {
                                start: start,
                                end: end,
                            })
                        }
                    >
                        <TimeSlot start={s} end={e} />
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

const OrderStack = ({ route, navigation }) => {
    const { address, timeSlots, price, image, id, phone, owner_id } =
        route.params;
    const Stack = createStackNavigator();
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

    const ChooseTime = ({ route, navigation }) => {
        const [start, setStart] = useState(route.params.start.toDate());
        const [end, setEnd] = useState(route.params.end.toDate());
        const [finalPrice, setFinalPrice] = useState(
            (price * (end.getTime() - start.getTime())) / (1000 * 3600)
        );

        return (
            <View>
                <Text style={globalStyles.subTitle}>
                    {'When do you come by?'}
                </Text>
                <View style={{ alignSelf: 'stretch' }}>
                    <CustomDateRangePicker
                        start={start}
                        end={end}
                        setSlot={(slot) => {
                            setStart(slot.start);
                            setEnd(slot.end);
                            setFinalPrice(
                                (price * (end.getTime() - start.getTime())) /
                                    (1000 * 3600)
                            );
                        }}
                        minDate={new Date(route.params.start.toDate())}
                        maxDate={new Date(route.params.end.toDate())}
                    />
                </View>
                <CustomButton
                    text='To Payment Page'
                    onPress={() =>
                        navigation.navigate('Payment Page', {
                            finalPrice,
                            start,
                            end,
                            id,
                        })
                    }
                />
                <Text
                    style={globalStyles.subTitle}
                >{`Price: ${finalPrice} NIS`}</Text>
            </View>
        );
    };

    return (
        <Stack.Navigator
            initialRouteName='Header'
            screenOptions={{
                presentation: 'modal',
                header: (props) => (
                    <MiniCard
                        {...props}
                        image={image}
                        ownerDetails={ownerDetails}
                        address={address}
                    />
                ),
            }}
        >
            <Stack.Group>
                <Stack.Screen
                    name='Choose Time Slot'
                    component={ChooseTimeSlot}
                    initialParams={{ timeSlots }}
                />
                <Stack.Screen name='Choose Time' component={ChooseTime} />
                <Stack.Screen name='Payment Page' component={PaymentPage} />
            </Stack.Group>
        </Stack.Navigator>
    );
};

export default OrderStack;

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
});
