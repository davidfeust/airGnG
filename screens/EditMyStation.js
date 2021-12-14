import React, {useContext, useEffect, useRef, useState} from "react";
import {Keyboard, ScrollView, Text, TextInput, TouchableWithoutFeedback, View,} from "react-native";
import {doc, getDoc, updateDoc} from "firebase/firestore";
import {db} from "../config/firebase";
import {globalStyles} from "../assets/styles/globalStyles";
import Checkbox from "expo-checkbox";

import {getStartAndEndTime, uploadImage} from "../utils/GlobalFuncitions";
import ImagePicker from "../components/ImagePicker";
import MyButton from "../components/MyButton";
import CustomDatePicker from "../components/CustomDatePicker";
import Autocomplete from "../components/Autocomplete";
import {AuthenticatedUserContext} from "../navigation/AuthenticatedUserProvider";
import StationForm from "./StationForm";

export default function EditMyStation({navigation, route}) {

    const {user} = useContext(AuthenticatedUserContext);
    const googleAddress = useRef();
    const [processing, setProcessing] = useState(false);

    const [formValues, setFormValues] = useState({
        phone: '',
        name: '',
        price: '',
        shadowed: false,
        timeSlots: [getStartAndEndTime()],
        image: null,
        cords: null,
        address: ''
    });

    /**
     * get all the data on the current post and set the values to be the initial values of the form
     */
    useEffect(async () => {
        const docRef = doc(db, "postedStation", route.params.id);
        const docSnap = await getDoc(docRef);
        const docData = docSnap.data();

        // convert timestamp of firebase to Date of JS
        let temp = [...docData.date];
        temp = temp.map((slot) => ({
            start: new Date(slot.start.toDate()),
            end: new Date(slot.end.toDate()),
        }))

        // set initial values of form from DB
        setFormValues({
            phone: docData.phone,
            name: docData.name,
            price: docData.price,
            shadowed: docData.shadowed,
            timeSlots: temp,
            image: docData.image,
            cords: docData.cords,
            address: docData.address
        });

    }, []);

    // we did another useEffect to prevent accessing and showing the unrender address
    useEffect(() => {
        googleAddress.current.setAddressText(formValues.address);
    }, [formValues.address]);

    async function onSave(values) {
        setProcessing(true);
        const {cords, image, name, phone, price, shadowed, timeSlots} = values;

        let image_url;
        if (image !== formValues.image) {
            image_url = await uploadImage(image, route.params.id);
            // TODO: remove the old image
        } else {
            image_url = image;
        }

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
            <View style={[globalStyles.container, {paddingTop: 60}]}>
                <Text style={globalStyles.title}>Edit</Text>
                <StationForm submit={onSave} formValues={formValues} googleAddress={googleAddress} processing={processing}/>
            </View>
        </TouchableWithoutFeedback>
    );
}
