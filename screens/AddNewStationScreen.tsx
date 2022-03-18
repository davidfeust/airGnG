import React, { RefObject, useContext, useRef, useState } from 'react';
import { Keyboard, Text, TouchableWithoutFeedback, View } from 'react-native';
import { globalStyles } from '../assets/styles/globalStyles';
import { db } from '../config/firebase';
import { addDoc, collection, updateDoc } from 'firebase/firestore';
import { AuthenticatedUserContext } from '../providers/AuthenticatedUserProvider';
import { uploadImage } from '../utils/GlobalFuncitions';
import StationForm from '../components/StationForm'; // to manage forms. docs: https://formik.org/docs/api/formik
import { GooglePlacesAutocompleteRef } from 'react-native-google-places-autocomplete';
import { LatLng } from 'react-native-maps';
import { Station } from '../App.d';

/**
 * create a page where the user fills a form
 * on submitting, the user returns to previouse screen,
 * and a listener uploads the data to fire base as js object
 * @returns <form>
 */

export default function AddNewStationScreen(props) {
    const { user } = useContext(AuthenticatedUserContext);
    const googleAddress = useRef<GooglePlacesAutocompleteRef>();
    const [processing, setProcessing] = useState(false);

    const formValues = {
        phone: '',
        name: '',
        price: '',
        shadowed: false,
        image: null,
        cords: null,
        plugType: null,
    };

    async function onPost({
        cords,
        image,
        price,
        shadowed,
        plugType,
    }: Station) {
        setProcessing(true);

        addDoc(collection(db, 'stations'), {
            owner_id: user.uid,
            address: googleAddress?.current?.getAddressText(),
            price: price,
            shadowed: shadowed,
            time_slots: [],
            cords: cords,
            creation_date: Date(),
            published: false,
            plug_type: plugType,
        })
            .then(async (docRef) => {
                if (image) {
                    const image_url = await uploadImage(
                        image,
                        `images_stations/${docRef.id}.jpg`
                    );
                    await updateDoc(docRef, {
                        image: image_url,
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
                console.error('Error adding document: ', e);
            });
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={[globalStyles.container, { paddingTop: 60 }]}>
                <Text style={globalStyles.title}>Station Details</Text>
                <StationForm
                    submit={onPost}
                    formValues={formValues}
                    googleAddress={googleAddress}
                    processing={processing}
                />
            </View>
        </TouchableWithoutFeedback>
    );
}
