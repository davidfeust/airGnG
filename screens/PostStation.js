import React, { useContext, useState } from "react";
import { Button, StyleSheet, TextInput, Text, View } from "react-native";
import { globalStyles } from "../assets/styles/globalStyles";
import Checkbox from "expo-checkbox";
import { getDatabase, ref, onValue } from "firebase/database";
import { db } from "../config/firebase";
import { collection, addDoc } from "firebase/firestore";
import { AuthenticatedUserContext } from "../navigation/AuthenticatedUserProvider";

/**
 * create a page where the user fills a form
 * on submitting, the user returns to previouse screen,
 * and a listener uploads the data to fire base as js object
 * @returns <form>
 */

export default function PostStation(props) {
  const { user } = useContext(AuthenticatedUserContext);

  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [shadowed, setShadowed] = useState(false);
  const [date, setDate] = useState("");
  const [image, setImage] = useState("");

  function buttonPost() {

    addDoc(collection(db, "postedStation"), {
      owner_id: user.uid,
      address: address,
      price: price,
      shadowed: shadowed,
      name: name,
      phone: phone,
      date: date,
      image: image,
    })
      .then((docRef) => {
        props.navigation.pop();
      })
      .catch((e) => console.error("Error adding document: ", e));
  }

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Station Details:</Text>
      <TextInput
        style={globalStyles.text_input}
        onChangeText={(text) => setAddress(text)}
        placeholder="Address"
      />
      <TextInput
        style={globalStyles.text_input}
        onChangeText={(text) => setPrice(text)}
        placeholder="Price per hour"
        keyboardType={"number-pad"}
      />
      <TextInput
        style={globalStyles.text_input}
        onChangeText={(text) => setDate(text)}
        placeholder="Date"
        keyboardType={"number-pad"}
      />
      <Text style={globalStyles.title}>Contact Details:</Text>
      <TextInput
        style={globalStyles.text_input}
        onChangeText={(text) => setName(text)}
        placeholder="Name"
      />
      <TextInput
        style={globalStyles.text_input}
        onChangeText={(text) => setPhone(text)}
        placeholder="Phone number"
        keyboardType={"phone-pad"}
      />
      <TextInput
        style={globalStyles.text_input}
        onChangeText={(text) => setImage(text)}
        placeholder="Image(url)"
        keyboardType={"number-pad"}
      />
      <View style={globalStyles.flex_container}>
        <Checkbox
          style={globalStyles.checkbox}
          value={shadowed}
          onValueChange={setShadowed}
        />
        <Text style={globalStyles.checkbox_label}>Shadowed parking spot</Text>
      </View>
      <Button style={globalStyles.bt} onPress={buttonPost} title={"post"} />
    </View>
  );
}

const styles = StyleSheet.create({});
