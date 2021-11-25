import React, { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,} from "react-native";
import {collection, query, where, deleteDoc, doc,getDoc,
  getDocs,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { AuthenticatedUserContext } from "../navigation/AuthenticatedUserProvider";
import MyStationCard from "../components/MyStationCard";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import PublicStationCard from "../components/PublicStationCard";

/**
 * represents all the subscribed stations.
 * (a subscribed station is a station that the user picked from SubscribeStation.js)
 * @returns <ScrollView>
 */
export default function Subscriptions({ navigation }) {
  const { user } = useContext(AuthenticatedUserContext);
  const [cards, setCards] = useState([]); // useState is needed because cards is directy connected to the screen

  const onCancel = (id) => {
    console.log();
    return Alert.alert(
      "Are your sure?",
      "Are you sure you want to cancel the submit?",
      [
        // The "Yes" button
        {
          text: "Yes",
          onPress: async () => {
            console.log("Yes");
            console.log(id);
            await deleteDoc(doc(db, "Subscriptions", id));
            setCards(cards.filter((card) => card.id !== id));
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

  const getCards = async () => {
    const col = query(
      collection(db, "Subscriptions"),
      where("subscriptor_id", "==", user.uid)
    );
    const cards_col = await getDocs(col);

    setCards(
      cards_col.docs.map((doc) => {


        let id = doc.id;
        let data = doc.data();

        return { id, ...data };
      })
    );
    console.log(cards);
  };

  useEffect(() => {
    navigation.addListener("focus", getCards); //whene we 'focus' the Subscriptions tab, getCards() is called
  }, []);
  return (
    <View>
      <ScrollView>
        {cards !== [] ? (
          cards.map(
            ({
              date_of_post,
              owner_name,
              id,
              owner_address,
              price,
              image,
            }) => {
              //    getDoc(
              // query(
              //   collection(db, "postedStation"),
              //   where("owner_id", "==", owner_id)
              // )
              //   ).then((d) => d.date);

              //   console.log("Date = " +date)
              return (<PublicStationCard
              id={id}
              owner={owner_name}
              address={owner_address}
               date={date_of_post}
                price={price}
              image={image}

              />);
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
