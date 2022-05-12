import { addDoc, collection, updateDoc } from 'firebase/firestore';
import React, { useContext, useRef, useState } from 'react';
import { Keyboard, Text, TouchableWithoutFeedback, View } from 'react-native';
import { GooglePlacesAutocompleteRef } from 'react-native-google-places-autocomplete';
import { Station } from '../App.d';
import { globalStyles } from '../assets/styles/globalStyles';
import StationForm from '../components/StationForm'; // to manage forms. docs: https://formik.org/docs/api/formik
import { db } from '../config/firebase';
import { AuthenticatedUserContext } from '../providers/AuthenticatedUserProvider';
import { uploadImage } from '../utils/GlobalFuncitions';

/**
 * create a page where the user fills a form
 * on submitting, the user returns to previouse screen,
 * and a listener uploads the data to fire base as js object
 * @returns <form>
 */

export default function AddNewStationScreen({ navigation }) {
    const { user } = useContext(AuthenticatedUserContext);
    const googleAddress = useRef<GooglePlacesAutocompleteRef>();
    const [processing, setProcessing] = useState(false);

    const formValues = {
        phone: '',
        name: '',
        price: '',
        image: null,
        cords: null,
        plugType: null,
    };

    async function onPost({ cords, image, price, plugType }: Station) {
        setProcessing(true);
        addDoc(collection(db, 'stations'), {
            owner_id: user.uid,
            address: googleAddress?.current?.getAddressText(),
            price: price,
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
                        navigation.pop();
                        setProcessing(false);
                    });
                } else {
                    navigation.pop();
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
