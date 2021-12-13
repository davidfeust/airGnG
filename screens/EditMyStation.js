import React, { useEffect, useRef, useState } from "react";
import {
    Keyboard,
    ScrollView,
    Text,
    TextInput,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import { globalStyles } from "../assets/styles/globalStyles";
import Checkbox from "expo-checkbox";

import { addressToCords, uploadImage } from "../utils/GlobalFuncitions";
import ImagePicker from "../components/ImagePicker";
import MyButton from "../components/MyButton";
import CustomDatePicker from "../components/CustomDatePicker";
import Autocomplete from "../components/Autocomplete";
import PhoneInputWithCountrySelect from "react-phone-number-input";

export default function EditMyStation({ navigation, route }) {
    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [shadowed, setShadowed] = useState(false);
    const [timeSlots, setTimeSlots] = useState([]);
    const [image, setImage] = useState(null);
    const [processing, setProcessing] = useState(false);
    const [cords, setCords] = useState(null);

    const googleAddress = useRef();

    useEffect(async () => {
        const docRef = doc(db, "postedStation", route.params.id);
        const docSnap = await getDoc(docRef);
        const docData = docSnap.data();
        setAddress(docData.address);
        setPhone(docData.phone);
        setName(docData.name);
        setPrice(docData.price);
        setShadowed(docData.shadowed);
        if (docData.date.constructor === Array) {
            const temp = [...docData.date];
            // convert timestamp of firebase to Date of JS
            setTimeSlots(
                temp.map((slot) => ({
                    start: new Date(slot.start.toDate()),
                    end: new Date(slot.end.toDate()),
                }))
            );
        } else {
            setTimeSlots([{ start: null, end: null }]);
        }
        setImage(docData.image);
    }, []);

    // we did another useEffect to prevent accessing and showing the unrender address
    useEffect(() => {
        googleAddress.current.setAddressText(address);
    }, [address]);

    async function onSave() {
        setProcessing(true);
        // const cords = await addressToCords(address);
        // TODO: Upload image only if changed and remove the old image
        const image_url = await uploadImage(image, route.params.id);
        const postRef = doc(db, "postedStation", route.params.id);
        await updateDoc(postRef, {
            address: googleAddress.current.getAddressText(),
            price: price,
            shadowed: shadowed,
            name: name,
            phone: phone,
            date: timeSlots,
            image: image_url,
            cords: cords,
        })
            .then(() => {
                setProcessing(false);
                navigation.pop();
            })
            .catch(() => setProcessing(false));
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={[globalStyles.container, { paddingTop: 60 }]}>
                <Text style={globalStyles.title}>Edit</Text>
                {/*<TextInput*/}
                {/*    style={globalStyles.text_input}*/}
                {/*    onChangeText={(text) => setAddress(text)}*/}
                {/*    placeholder="Address"*/}
                {/*    value={address}*/}
                {/*/>*/}

                <Autocomplete reference={googleAddress} setCords={setCords} />
                <ScrollView style={{ backgroundColor: "white" }}>
                    <View style={globalStyles.container}>
                        <TextInput
                            style={globalStyles.text_input}
                            onChangeText={(text) => setPrice(text)}
                            placeholder="Price per hour"
                            keyboardType={"number-pad"}
                            value={price}
                        />
                        {timeSlots && (
                            <CustomDatePicker
                                setTimeSlots={setTimeSlots}
                                timeSlots={timeSlots}
                            />
                        )}

                        <Text style={globalStyles.subTitle}>contact info:</Text>
                        <TextInput
                            style={globalStyles.text_input}
                            onChangeText={(text) => setName(text)}
                            placeholder="Name"
                            value={name}
                        />

                        {/* <PhoneInputWithCountry
                            name="phoneInputWithCountrySelect"
                            control={control}
                            rules={{ required: true }}
                        /> */}
                        <TextInput
                            style={globalStyles.text_input}
                            onChangeText={(text) => setPhone(text)}
                            placeholder="Phone number"
                            keyboardType={"phone-pad"}
                            value={phone}
                        />
                        <ImagePicker image={image} setImage={setImage} />

                        <Text>Shadowed parking spot</Text>
                        <Checkbox
                            value={shadowed}
                            onValueChange={setShadowed}
                        />

                        <MyButton
                            style={globalStyles.bt}
                            onPress={onSave}
                            text={"Save"}
                            processing={processing}
                        />
                    </View>
                </ScrollView>
            </View>
        </TouchableWithoutFeedback>
    );
}
