import React, {useEffect, useRef, useState} from "react";
import {Keyboard, Text, TouchableWithoutFeedback, View,} from "react-native";
import {doc, getDoc, updateDoc} from "firebase/firestore";
import {db, storage} from "../config/firebase";
import {globalStyles} from "../assets/styles/globalStyles";

import {getStartAndEndTime, uploadImage} from "../utils/GlobalFuncitions";
import StationForm from "../components/StationForm";
import {deleteObject, ref} from "@firebase/storage";

export default function EditMyStation({navigation, route}) {

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
        const docRef = doc(db, "stations", route.params.station_id);
        const docSnap = await getDoc(docRef);
        const docData = docSnap.data();


        // set initial values of form from DB
        setFormValues({
            price: docData.price,
            shadowed: docData.shadowed,
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
        const {cords, image, price, shadowed} = values;

        let image_url = null;
        if (image !== formValues.image) {
            // image changed
            if (!image) {
                const imgRef = ref(storage, `images_stations/${route.params.station_id}.jpg`);
                // Delete the file
                deleteObject(imgRef).then(() => {
                    // File deleted successfully
                }).catch((error) => {
                    // Uh-oh, an error occurred!
                    console.error(error);
                });

            } else {
                image_url = await uploadImage(image, `images_stations/${route.params.station_id}.jpg`);
            }
        } else {
            image_url = image;
        }

        const postRef = doc(db, "stations", route.params.station_id);
        await updateDoc(postRef, {
            address: googleAddress.current.getAddressText(),
            price: price,
            shadowed: shadowed,
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
                <StationForm submit={onSave} formValues={formValues} googleAddress={googleAddress}
                             processing={processing}/>
            </View>
        </TouchableWithoutFeedback>
    );
}
