import React, { useContext } from 'react';
import { ActivityIndicator, Alert, ScrollView, Text, View } from 'react-native';
import { arrayRemove, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { myOrdersContext } from '../../providers/MyOrdersProvider';
import { globalStyles } from '../../assets/styles/globalStyles';
import CustomButton from '../../components/CustomButton';
import { AuthenticatedUserContext } from '../../providers/AuthenticatedUserProvider';
import MyOrderCard from '../../components/MyOrderCard';
import { colors } from '../../assets/styles/colors';

/**
 * represents all the subscribed stations.
 * (a subscribed station is a station that the user picked from SearchStationTab.js)
 * @returns <ScrollView>
 */
export default function MyOrdersTab({ navigation }) {
    const { myOrders, isLoading } = useContext(myOrdersContext);
    const { user } = useContext(AuthenticatedUserContext);

    const onCancel = (orderId: string) => {
        return Alert.alert(
            'Are your sure?',
            'Are you sure you want to cancel the submit?',
            [
                // The "Yes" button
                {
                    text: 'Yes',
                    onPress: async () => {
                        deleteDoc(doc(db, 'orders', orderId)).then(() => {
                            console.log('deleted order number', orderId);
                        });
                        updateDoc(doc(db, 'users', user.uid), {
                            orders: arrayRemove(orderId),
                        });
                        // updateMyOrders();
                    },
                },
                // The "No" button
                // Does nothing but dismiss the dialog when tapped
                {
                    text: 'No',
                },
            ]
        );
    };
    if (isLoading) {
        return (
            <View
                style={[globalStyles.container, { justifyContent: 'center' }]}
            >
                <ActivityIndicator color={colors.primary} size={'large'} />
            </View>
        );
    } else if (myOrders.length !== 0) {
        return (
            <ScrollView>
                {myOrders.map((order) => (
                    <MyOrderCard
                        order={order}
                        onCancel={onCancel}
                        key={order.id}
                    />
                ))}
            </ScrollView>
        );
    }
    return (
        <View
            style={{
                justifyContent: 'center',
                alignItems: 'center',
                flex: 1,
            }}
        >
            <Text style={globalStyles.subTitle}>No orders yet...</Text>
            <CustomButton
                text={'Search Station'}
                onPress={() => navigation.navigate('SearchStationTab')}
            />
        </View>
    );
}
