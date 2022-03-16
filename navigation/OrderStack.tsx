import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { colors } from '../assets/styles/colors';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import TimeSlot from '../components/TimeSlot';
import CustomDateRangePicker from '../components/CustomDateRangePicker';
import { createStackNavigator } from '@react-navigation/stack';
import { Divider } from 'react-native-elements/dist/divider/Divider';
import CustomButton from '../components/CustomButton';
import PaymentPage from '../pages/PaymentPage';
import MiniCard from '../components/MiniCard';

const ChooseTimeSlot = ({ route, navigation }) => {
    return (
        <View style={{ alignSelf: 'center' }}>
            <Text style={styles.orderTitle}>Creating Your Order</Text>
            <Divider />
            <Text style={styles.orderSubTitle}>
                Lets start with Choosing your Slot
            </Text>
            <ScrollView style={{ marginTop: 20 }}>
                {route.params.time_slots.map((slot, idx) => {
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
            </ScrollView>
        </View>
    );
};

const OrderStack = ({ route, navigation }) => {
    const { address, time_slots, price, image, id, phone, owner_id } =
        route.params;
    const Stack = createStackNavigator();
    const [ownerDetails, setOwnerDetails] = useState(null);

    useEffect(() => {
        const ownerRef = doc(db, 'users', owner_id);
        getDoc(ownerRef)
            .then((ownerObject) => {
                setOwnerDetails(ownerObject.data());
            })
            .catch((err) => console.error(err));
    }, [owner_id]);

    const ChooseTime = ({ route, navigation }) => {
        const [start, setStart] = useState(route.params.start.toDate());
        const [end, setEnd] = useState(route.params.end.toDate());
        const [finalPrice, setFinalPrice] = useState(
            (price * (end.getTime() - start.getTime())) / (1000 * 3600)
        );

        return (
            <View style={{ alignItems: 'center' }}>
                <Text style={styles.orderSubTitle}>
                    {'When do you come by?'}
                </Text>
                <View style={{ alignSelf: 'stretch', marginTop: 50 }}>
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
                    style={{ marginTop: 140 }}
                    onPress={() => {
                        navigation.setOptions({ start: start, end: end });
                        navigation.navigate('Payment Page', {
                            finalPrice,

                            id,
                        });
                    }}
                />
                <Text
                    style={{
                        color: colors.primary,
                        fontSize: 18,
                        textAlign: 'center',
                    }}
                >
                    {`Price:\n${finalPrice} NIS`}
                </Text>
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
                    initialParams={{ time_slots }}
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
    orderTitle: {
        marginTop: 38,
        fontSize: 32,
        color: colors.primary,
        textAlign: 'center',
    },
    orderSubTitle: {
        marginTop: 25,
        fontSize: 26,
        color: colors.secondary,
        textAlign: 'center',
        maxWidth: '70%',
    },
});
