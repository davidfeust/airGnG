import React, {useContext, useEffect, useState} from 'react';
import {Button, StyleSheet, Text, TextInput, View} from 'react-native';
import {AuthenticatedUserContext} from "../navigation/AuthenticatedUserProvider";
import {addDoc, collection, getDocs} from "firebase/firestore";
import {db} from "../config/firebase";
import {globalStyles} from "../assets/styles/globalStyles";
import Checkbox from "expo-checkbox";
import {doc, getDoc, updateDoc} from "firebase/firestore";


export default function EditMyStation({navigation, route}) {


    const {user} = useContext(AuthenticatedUserContext);

    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [shadowed, setShadowed] = useState(false);
    const [date, setDate] = useState("");
    const [image, setImage] = useState("");

    useEffect(async () => {
        const docRef = doc(db, "postedStation", route.params.id);
        const docSnap = await getDoc(docRef);
        const docData = docSnap.data();
        setAddress(docData.address)
        setPhone(docData.phone)
        setName(docData.name)
        setPrice(docData.price)
        setShadowed(docData.shadowed)
        setDate(docData.date)
        setImage(docData.image)
    }, [])

    async function onSave() {
        const postRef = doc(db, "postedStation", route.params.id);
        await updateDoc(postRef, {
            address: address,
            price: price,
            shadowed: shadowed,
            name: name,
            phone: phone,
            date: date,
            image: image,
        });
        navigation.pop();
    }

    return (
        <View style={globalStyles.container}>
            <Text style={globalStyles.title}>
                Edit
            </Text>
            <TextInput
                onChangeText={(text) => setAddress(text)}
                placeholder="Address"
                value={address}
            />
            <TextInput
                onChangeText={(text) => setPrice(text)}
                placeholder="Price per hour"
                keyboardType={"number-pad"}
                value={price}

            />
            <TextInput
                onChangeText={(text) => setDate(text)}
                placeholder="Date"
                keyboardType={"number-pad"}
                value={date}

            />
            <Text>contact info:</Text>
            <TextInput onChangeText={(text) => setName(text)} placeholder="Name"/>
            <TextInput
                onChangeText={(text) => setPhone(text)}
                placeholder="Phone number"
                keyboardType={"phone-pad"}
                value={phone}

            />
            <TextInput
                onChangeText={(text) => setImage(text)}
                placeholder="Image(url)"
                keyboardType={"number-pad"}
                value={image}

            />
            <Text>Shadowed parking spot</Text>
            <Checkbox value={shadowed} onValueChange={setShadowed}/>
            {/*<Button onPress={buttonPost} title={"post"}/>*/}

            <Button title={"save"} onPress={onSave}/>
        </View>
    );


}

const styles = StyleSheet.create({});