import React, {useContext, useState} from "react";
import {Button, StyleSheet, Text, TextInput, View} from "react-native";
import {globalStyles} from "../assets/styles/globalStyles";
import Checkbox from "expo-checkbox";
import {db} from "../config/firebase";
import {addDoc, collection, updateDoc} from "firebase/firestore";
import {AuthenticatedUserContext} from "../navigation/AuthenticatedUserProvider";
import {addressToCords, uploadImage} from "../utils/GlobalFuncitions";
import CustomDatePicker from "../components/CustomDatePicker";
import ImagePicker from "../components/ImagePicker";
import MyButton from "../components/MyButton";

/**
 * create a page where the user fills a form
 * on submitting, the user returns to previouse screen,
 * and a listener uploads the data to fire base as js object
 * @returns <form>
 */

export default function PostStation(props) {
    const {user} = useContext(AuthenticatedUserContext);

    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [shadowed, setShadowed] = useState(false);
    const [date, setDate] = useState("");
    const [image, setImage] = useState(null);
    const [processing, setProcessing] = useState(false);

    async function buttonPost() {
        setProcessing(true);
        const cords = await addressToCords(address);

        addDoc(collection(db, "postedStation"), {
            owner_id: user.uid,
            address: address,
            price: price,
            shadowed: shadowed,
            name: name,
            phone: phone,
            date: date,
            cords: cords,
        })
            .then(async (docRef) => {
                const image_url = await uploadImage(image, docRef.id);
                await updateDoc(docRef, {
                    image: image_url
                });
                props.navigation.pop();
                setProcessing(false);
            })
            .catch((e) => {
                setProcessing(false);
                console.error("Error adding document: ", e);
            });
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
            <CustomDatePicker/>
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

            <ImagePicker image={image} setImage={setImage}/>

            <View style={globalStyles.flex_container}>
                <Checkbox
                    style={globalStyles.checkbox}
                    value={shadowed}
                    onValueChange={setShadowed}
                />
                <Text style={globalStyles.checkbox_label}>Shadowed parking spot</Text>
            </View>
            <MyButton style={globalStyles.bt} onPress={buttonPost} text={'post'} processing={processing}/>
        </View>
    );
}

const styles = StyleSheet.create({});
