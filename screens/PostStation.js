import React, {useContext, useState} from "react";
import {Keyboard, ScrollView, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View} from "react-native";
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
    const [timeSlots, setTimeSlots] = useState([{start: null, end: null}]);
    const [image, setImage] = useState(null);
    const [processing, setProcessing] = useState(false);

    async function buttonPost() {
        setProcessing(true);
        const cords = await addressToCords(address);
        const filteredDates = timeSlots
            .filter((slot) => slot.start && slot.end)
            .map(slot => {
                return {start: slot.start, end: slot.end}
            });

        addDoc(collection(db, "postedStation"), {
            owner_id: user.uid,
            address: address,
            price: price,
            shadowed: shadowed,
            name: name,
            phone: phone,
            date: filteredDates,
            cords: cords,
        })
            .then(async (docRef) => {
                if (image) {
                    const image_url = await uploadImage(image, docRef.id);
                    await updateDoc(docRef, {
                        image: image_url
                    }).then(() => {
                        props.navigation.pop();
                        setProcessing(false);
                    });
                } else {
                    props.navigation.pop();
                    setProcessing(false);
                }
            })
            .catch((e) => {
                setProcessing(false);
                console.error("Error adding document: ", e);
            });
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ScrollView style={{backgroundColor: 'white', flex: 1}}>
                <View style={[globalStyles.container, {paddingTop: 60}]}>
                    <Text style={globalStyles.title}>Station Details</Text>
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

                    <CustomDatePicker setTimeSlots={setTimeSlots} timeSlots={timeSlots}/>

                    <Text style={globalStyles.subTitle}>Contact Details</Text>
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
            </ScrollView>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({});
