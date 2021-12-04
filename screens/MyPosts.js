import React, { useContext } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../config/firebase";
import MyStationCard from "../components/MyStationCard";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { colors } from "../assets/styles/colors";
import { publicStationsContext } from "../navigation/PublicStationsProvider";
import { AuthenticatedUserContext } from "../navigation/AuthenticatedUserProvider";

/**
 * represents the page where a user can see the status of his post.
 * for now, its not posible that more than 1 user will subscribe per post,
 * but it might change...
 * @returns <ScrollView>
 */
export default function MyPosts({ navigation }) {
  const { user } = useContext(AuthenticatedUserContext);
  const { cards } = useContext(publicStationsContext);
  const myPosts = cards.filter(({ owner_id }) => owner_id === user.uid);

  const onEdit = (id) => {
    navigation.push("EditMyStation", { id: id }); // push to the navigation EditMyStation() component' so we could go back
  };

  const onDelete = (id) => {
    return Alert.alert(
      "Are your sure?",
      "Are you sure you want to remove this beautiful box?",
      [
        // The "Yes" button
        {
          text: "Yes",
          onPress: async () => {
            await deleteDoc(doc(db, "postedStation", id));
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

  return (
    <View>
      <TouchableOpacity
        style={styles.plus}
        onPress={() => navigation.push("PostStation")}
      >
        <MaterialCommunityIcons
          style={{ textAlign: "center" }}
          name={"plus"}
          color={"black"}
          size={26}
        />
      </TouchableOpacity>

      <ScrollView>
        {myPosts !== [] ? (
          myPosts.map(({ name, address, price, image, date, id }) => (
            <MyStationCard
              owner={name}
              address={address}
              price={price}
              image={image}
              date={date}
              id={id}
              onDelete={onDelete}
              onEdit={onEdit}
              key={id}
            />
          ))
        ) : (
          <ActivityIndicator size={"large"} color="blue" />
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  replaceMe: { alignItems: "center" },
  plus: {
    backgroundColor: colors.primary,
    alignContent: "center",
    justifyContent: "center",
    width: 55,
    height: 55,
    borderRadius: 30,
    position: "absolute",
    bottom: 15,
    right: 15,
    zIndex: 2,
  },
});
