import React, { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
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
import { db } from "../config/firebase";
import { AuthenticatedUserContext } from "../navigation/AuthenticatedUserProvider";
import PublicStationCard from "../components/PublicStationCard";
import { myOrdersContext } from "../navigation/MyOrdersProvider";
import { publicStationsContext } from "../navigation/PublicStationsProvider";
import MyStationCard from "../components/MyStationCard";

/**
 * represents all the subscribed stations.
 * (a subscribed station is a station that the user picked from SearchStation.js)
 * @returns <ScrollView>
 */
export default function Subscriptions({ navigation }) {
  const { user } = useContext(AuthenticatedUserContext);
  const { myOrders } = useContext(myOrdersContext);
  const { cards } = useContext(publicStationsContext); // useState is needed because cards is directy connected to the screen
  const myOrdersCards = cards.filter(({ id }) =>
    myOrders.some(({ station_id }) => station_id == id)
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

  // useEffect(() => {
  //   // navigation.addListener("focus", getCards); //whene we 'focus' the Subscriptions tab, getCards() is called

  // }, []);
  return (
    <View>
      <ScrollView>
        {myOrdersCards !== [] ? (
          myOrdersCards.map(
            ({ date_of_post, owner_name, id, owner_address, price, image }) => {
              return (
                <MyStationCard
                  key={id}
                  id={id}
                  owner={owner_name}
                  address={owner_address}
                  date={date_of_post}
                  price={price}
                  image={image}
                  onDelete={() => onCancel(id)}
                />
              );
            }
          )
        ) : (
          <ActivityIndicator size={"large"} color="blue" />
        )}
      </ScrollView>
    </View>
  );
}

const styles2 = StyleSheet.create({
  replaceMe: { alignItems: "center" },
});

const styles = StyleSheet.create({
  replaceMe: { alignItems: "center" },
  plus: {
    backgroundColor: "blue",
    borderRadius: 50,
    height: 50,
    width: 50,
    alignContent: "center",
    justifyContent: "center",
  },
});
