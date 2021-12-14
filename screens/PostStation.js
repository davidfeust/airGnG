import React, {useContext, useRef, useState} from "react";
import {Keyboard, Text, TouchableWithoutFeedback, View} from "react-native";
import {globalStyles} from "../assets/styles/globalStyles";
import {db} from "../config/firebase";
import {addDoc, collection, updateDoc} from "firebase/firestore";
import {AuthenticatedUserContext} from "../navigation/AuthenticatedUserProvider";
import {getStartAndEndTime, uploadImage} from "../utils/GlobalFuncitions";
import StationForm from "../components/StationForm"; // to manage forms. docs: https://formik.org/docs/api/formik

/**
 * create a page where the user fills a form
 * on submitting, the user returns to previouse screen,
 * and a listener uploads the data to fire base as js object
 * @returns <form>
 */

export default function PostStation(props) {

    const {user} = useContext(AuthenticatedUserContext);
    const googleAddress = useRef();
    const [processing, setProcessing] = useState(false);

    const formValues = {
        phone: '',
        name: '',
        price: '',
        shadowed: false,
        timeSlots: [getStartAndEndTime()],
        image: null,
        cords: null,
    };

    async function onPost(values) {
        setProcessing(true);
        const {cords, image, name, phone, price, shadowed, timeSlots} = values;
        const filteredDates = timeSlots
            .filter((slot) => slot.start && slot.end)
            .map(slot => {
                return {start: slot.start, end: slot.end}
            });

        addDoc(collection(db, "postedStation"), {
            owner_id: user.uid,
            address: googleAddress.current.getAddressText(),
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
            <View style={[globalStyles.container, {paddingTop: 60}]}>
                <Text style={globalStyles.title}>Station Details</Text>
                <StationForm submit={onPost} formValues={formValues} googleAddress={googleAddress}/>
            </View>
        </TouchableWithoutFeedback>
    );
}
