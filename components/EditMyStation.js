import React, { useContext, useEffect, useState } from "react";
import { Button, Image, StyleSheet, Text, TextInput, View } from "react-native";
import { AuthenticatedUserContext } from "../navigation/AuthenticatedUserProvider";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db, storage } from "../config/firebase";
import { globalStyles } from "../assets/styles/globalStyles";
import Checkbox from "expo-checkbox";
import BootstrapStyleSheet from "react-native-bootstrap-styles";
import * as ImagePicker from "expo-image-picker";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { addressToCords } from "../utils/GlobalFuncitions";

const bootstrapStyleSheet = new BootstrapStyleSheet();
const { s, c } = bootstrapStyleSheet;

export default function EditMyStation({ navigation, route }) {
  const { user } = useContext(AuthenticatedUserContext);

  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [shadowed, setShadowed] = useState(false);
  const [date, setDate] = useState("");
  const [image, setImage] = useState(null);

  useEffect(async () => {
    const docRef = doc(db, "postedStation", route.params.id);
    const docSnap = await getDoc(docRef);
    const docData = docSnap.data();
    setAddress(docData.address);
    setPhone(docData.phone);
    setName(docData.name);
    setPrice(docData.price);
    setShadowed(docData.shadowed);
    setDate(docData.date);
    setImage(docData.image);
  }, []);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("not permitted");
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  const uploadImage = async (uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const storageRef = await ref(storage, `${route.params.id}.jpg`);
    await uploadBytes(storageRef, blob);
    return await getDownloadURL(storageRef, `${route.params.id}.jpg`);
  };

  async function onSave() {
    const cords = await addressToCords(address);
    const image_url = await uploadImage(image);
    const postRef = doc(db, "postedStation", route.params.id);
    await updateDoc(postRef, {
      address: address,
      price: price,
      shadowed: shadowed,
      name: name,
      phone: phone,
      date: date,
      image: image_url,
      cords: cords,
    });
    navigation.pop();
  }

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Edit</Text>
      <TextInput
        style={globalStyles.text_input}
        onChangeText={(text) => setAddress(text)}
        placeholder="Address"
        value={address}
      />
      <TextInput
        style={globalStyles.text_input}
        onChangeText={(text) => setPrice(text)}
        placeholder="Price per hour"
        keyboardType={"number-pad"}
        value={price}
      />
      <TextInput
        style={globalStyles.text_input}
        onChangeText={(text) => setDate(text)}
        placeholder="Date"
        keyboardType={"number-pad"}
        value={date}
      />
      <Text>contact info:</Text>
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
        value={phone}
      />
      <Button onPress={pickImage} title="upload station image" />

      {image != null ? (
        <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />
      ) : null}

      <Text>Shadowed parking spot</Text>
      <Checkbox value={shadowed} onValueChange={setShadowed} />
      {/*<Button onPress={buttonPost} title={"post"}/>*/}

      <Button title={"save"} onPress={onSave} />
    </View>
  );
}

const styles = StyleSheet.create({});
