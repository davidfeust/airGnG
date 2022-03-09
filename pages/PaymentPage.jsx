import React, { useState, useContext } from 'react';
import { AuthenticatedUserContext } from '../providers/AuthenticatedUserProvider';
import { View, Text, Alert } from 'react-native';
import CustomButton from '../components/CustomButton';
import { globalStyles } from '../assets/styles/globalStyles';
import {
    addDoc,
    arrayUnion,
    collection,
    doc,
    updateDoc,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import Checkbox from 'expo-checkbox';

const PaymentPage = ({ route, navigation }) => {
    const [processing, setProcessing] = useState(false);
    const { user } = useContext(AuthenticatedUserContext);
    const { start, end, finalPrice, id } = route.params;
    const [validated, setValidated] = useState(false);

    const onOrder = () => {
        if (start && end) {
            setProcessing(true);
            addDoc(collection(db, 'orders'), {
                sub_id: user.uid,
                date_of_sub: new Date(),
                reservation: {
                    date_start: start,
                    date_finish: end,
                },
                station_id: id,
                payed: false,
                sub_car_type:
                    'the user might have an incompatible type of charge for his card',
            })
                .then((orderRef) => {
                    const userRef = doc(db, 'users', user.uid);
                    updateDoc(userRef, {
                        orders: arrayUnion(orderRef.id),
                    }).then(() => {
                        navigation.navigate('My Orders');
                        setProcessing(false);
                    });
                })
                .catch((e) => {
                    console.error('Error adding document: ', e);
                    setProcessing(false);
                });
        } else {
            Alert.alert('Error', 'Please choose a date from the dropdown.', [
                {
                    text: 'Close',
                },
            ]);
        }
    };

    return (
        <View>
            <Text style={globalStyles.title}>This is the payment page</Text>
            <Text
                style={globalStyles.subTitle}
            >{`Price: ${finalPrice} NIS`}</Text>
            <View style={globalStyles.flex_container}>
                <Checkbox
                    style={globalStyles.checkbox}
                    value={validated}
                    onValueChange={(nextValue) => setValidated(nextValue)}
                />
                <Text style={globalStyles.checkbox_label}>
                    simulate validated payment details
                </Text>
            </View>

            <CustomButton
                disabled={!validated}
                processing={processing}
                text='order without paying :)'
                onPress={onOrder}
            />
        </View>
    );
};
export default PaymentPage;
