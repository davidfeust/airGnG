import React, {useContext, useEffect, useState} from "react";
import {
    ActivityIndicator,
    Alert, Dimensions,
    ScrollView,
    StyleSheet, Text,
    TouchableOpacity,
    View,
} from "react-native";
import {
    collection,
    query,
    where,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
} from "firebase/firestore";
import {db} from "../config/firebase";
import {AuthenticatedUserContext} from "../navigation/AuthenticatedUserProvider";
import PublicStationCard from "../components/PublicStationCard";
import {myOrdersContext} from "../navigation/MyOrdersProvider";
import {publicStationsContext} from "../navigation/PublicStationsProvider";
import MyStationCard from "../components/MyStationCard";
import {colors} from "../assets/styles/colors";
import {globalStyles} from "../assets/styles/globalStyles";
import MyButton from "../components/MyButton";

/**
 * represents all the subscribed stations.
 * (a subscribed station is a station that the user picked from SearchStation.js)
 * @returns <ScrollView>
 */
export default function Subscriptions({navigation}) {
    const {user} = useContext(AuthenticatedUserContext);
    const {myOrders} = useContext(myOrdersContext);
    const {cards} = useContext(publicStationsContext); // useState is needed because cards is directy connected to the screen
    const myOrdersCards = cards.filter(({id}) =>
        myOrders.some(({station_id}) => station_id === id)
    );
    const onCancel = (id) => {
        return Alert.alert(
            "Are your sure?",
            "Are you sure you want to cancel the submit?",
            [
                // The "Yes" button
                {
                    text: "Yes",
                    onPress: async () => {
                        // await getDocs(
                        //   query(
                        //     collection(db, "subscriptions"),
                        //     where("station_id", "==", id)
                        //   )
                        // ).then((docs) => docs.forEach((doc) => deleteDoc(doc)));
                        const toDelete = await getDocs(
                            query(
                                collection(db, "subscriptions"),
                                where("station_id", "==", id)
                            )
                        );
                        toDelete.forEach((doc) => deleteDoc(doc.ref));
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
                {myOrdersCards.map(({name, address, price, date, id, image}) =>
                    (
                        <MyStationCard
                            key={id}
                            id={id}
                            owner={name}
                            address={address}
                            date={date}
                            price={price}
                            image={image}
                            onDelete={() => onCancel(id)}
                        />
                    ))
                }
            </ScrollView>
        );
    } else {
        return (
            <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
                <Text style={globalStyles.subTitle}>No subscription yet...</Text>
                <MyButton text={'Search Station'} onPress={() => navigation.navigate('SearchStation')}/>
            </View>
        );
    }
}
