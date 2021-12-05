import React, {useContext, useEffect, useState} from "react";
import {Text, TextInput, View} from "react-native";
import {AuthenticatedUserContext} from "../navigation/AuthenticatedUserProvider";
import {doc, getDoc, updateDoc} from "firebase/firestore";
import {db} from "../config/firebase";
import {globalStyles} from "../assets/styles/globalStyles";
import Checkbox from "expo-checkbox";

import {addressToCords, uploadImage} from "../utils/GlobalFuncitions";
import ImagePicker from "../components/ImagePicker";
import MyButton from "../components/MyButton";


export default function EditMyStation({navigation, route}) {
    const {user} = useContext(AuthenticatedUserContext);

    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [shadowed, setShadowed] = useState(false);
    const [date, setDate] = useState("");
    const [image, setImage] = useState(null);
    const [processing, setProcessing] = useState(false);

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

    async function onSave() {
        setProcessing(true);
        const cords = await addressToCords(address);
        const image_url = await uploadImage(image, route.params.id);
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
        }).then(() => {
            setProcessing(false);
            navigation.pop();
        }).catch(() => setProcessing(false));

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
            <ImagePicker image={image} setImage={setImage}/>

            <Text>Shadowed parking spot</Text>
            <Checkbox value={shadowed} onValueChange={setShadowed}/>

            <MyButton style={globalStyles.bt} onPress={onSave} text={'Sava'} processing={processing}/>

        </View>
    );
}
