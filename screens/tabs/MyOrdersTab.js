import React, { useContext, useEffect, useState } from "react";
import { Alert, ScrollView, Text, View } from "react-native";
import {
    arrayRemove,
    collection,
    deleteDoc,
    doc,
    getDocs,
    query,
    updateDoc,
    where,
} from "firebase/firestore";
import { db } from "../../config/firebase";
import { myOrdersContext } from "../../providers/MyOrdersProvider";
import { publicStationsContext } from "../../providers/PublicStationsProvider";
import MyStationCard from "../../components/MyStationCard";
import { globalStyles } from "../../assets/styles/globalStyles";
import CustomButton from "../../components/CustomButton";
import { AuthenticatedUserContext } from "../../providers/AuthenticatedUserProvider";
import MyOrderCard from "../../components/MyOrderCard";

/**
 * represents all the subscribed stations.
 * (a subscribed station is a station that the user picked from SearchStationTab.js)
 * @returns <ScrollView>
 */
export default function MyOrdersTab({ navigation }) {
    const { myOrders, updateMyOrders } = useContext(myOrdersContext);
    const { stations } = useContext(publicStationsContext);
    const { user } = useContext(AuthenticatedUserContext);

    const [myOrdersCards, setMyOrdersCards] = useState([]); // useState is needed because cards is directy connected to the screen

    const onCancel = (order_id) => {
        return Alert.alert(
            "Are your sure?",
            "Are you sure you want to cancel the submit?",
            [
                // The "Yes" button
                {
                    text: "Yes",
                    onPress: async () => {
                        deleteDoc(doc(db, "orders", order_id)).then(() => {
                            console.log("deleted order number", order_id);
                        });
                        updateDoc(doc(db, "users", user.uid), {
                            orders: arrayRemove(order_id),
                        });
                        updateMyOrders();
                    },
                },
                // The "No" button
                // Does nothing but dismiss the dialog when tapped
                {
                    text: "No",
                },
            ]
        );
    };
    if (myOrders.length !== 0) {
        return (
            <ScrollView>
                {myOrders.map(
                    ({
                        date_of_sub,
                        payed,
                        reservation,
                        station_id,
                        sub_car_type,
                        sub_id,
                        id,
                    }) => (
                        <MyOrderCard
                            date_of_sub={date_of_sub}
                            payed={payed}
                            reservation={reservation}
                            station_id={station_id}
                            sub_car_type={sub_car_type}
                            sub_id={sub_id}
                            order_id={id}
                            onCancel={onCancel}
                            key={id}
                        />
                    )
                )}
            </ScrollView>
        );
    } else {
        return (
            <View
                style={{
                    justifyContent: "center",
                    alignItems: "center",
                    flex: 1,
                }}
            >
                <Text style={globalStyles.subTitle}>No orders yet...</Text>
                <CustomButton
                    text={"Search Station"}
                    onPress={() => navigation.navigate("SearchStationTab")}
                />
            </View>
        );
    }
}
