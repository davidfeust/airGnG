import React, {useContext, useEffect, useState} from "react";
import {Alert, ScrollView, Text, View,} from "react-native";
import {arrayRemove, collection, deleteDoc, doc, getDocs, query, updateDoc, where,} from "firebase/firestore";
import {db} from "../config/firebase";
import {myOrdersContext} from "../providers/MyOrdersProvider";
import {publicStationsContext} from "../providers/PublicStationsProvider";
import MyStationCard from "../components/MyStationCard";
import {globalStyles} from "../assets/styles/globalStyles";
import MyButton from "../components/MyButton";
import {AuthenticatedUserContext} from "../providers/AuthenticatedUserProvider";

/**
 * represents all the subscribed stations.
 * (a subscribed station is a station that the user picked from SearchStation.js)
 * @returns <ScrollView>
 */
export default function MyOrders({navigation}) {
    const {myOrders} = useContext(myOrdersContext);
    const {stations} = useContext(publicStationsContext); 
    const {user} = useContext(AuthenticatedUserContext);

    const [myOrdersCards, setMyOrdersCards] = useState([]);// useState is needed because cards is directy connected to the screen
    useEffect(() => {
        setMyOrdersCards(
            stations.filter(({id}) =>
                myOrders.some(({station_id}) => station_id === id)
            )
        );
    }, [myOrders, stations]);

    const onCancel = (station_id) => {
        return Alert.alert(
            "Are your sure?",
            "Are you sure you want to cancel the submit?",
            [
                // The "Yes" button
                {
                    text: "Yes",
                    onPress: async () => {
                        const toDelete = await getDocs(
                            query(
                                collection(db, "orders"),
                                where("station_id", "==", station_id)
                            )
                        )
                        // TODO erase the order from the users.orders using the order id
                        //
                        //     .then(async value => {
                        //     const orderId = value.docs.pop().id;
                        //     const userDoc = doc(db, 'users', user.uid);
                        //     console.log(orderId)
                        //     await updateDoc(userDoc, {
                        //         orders: arrayRemove(orderId)
                        //     });
                        // })

                        toDelete.forEach((adoc) => {
                            deleteDoc(adoc.ref);
                        });
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

    if (myOrdersCards.length !== 0) {
        return (
            
            <ScrollView>
                {myOrdersCards.map(
                    ({address, price, date, id, image, time_slots}) => (
                        <MyStationCard
                            key={id}
                            id={id}
                            owner={user.name}
                            address={address}
                            date={date}
                            price={price}
                            image={image}
                            onDelete={() => onCancel(id)}
                            phone={user.phone}
                            dateStart={"s"} // TODO: get the start end time- didnt undarstand how...
                            dateFinish={"e"}// its allready rendered.
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
                <Text style={globalStyles.subTitle}>
                    No orders yet...
                </Text>
                <MyButton
                    text={"Search Station"}
                    onPress={() => navigation.navigate("SearchStation")}
                />
            </View>
        );
    }
}
