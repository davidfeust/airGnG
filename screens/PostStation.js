import React, {useContext, useRef, useState} from "react";
import {Keyboard, ScrollView, Text, TextInput, TouchableWithoutFeedback, View} from "react-native";
import {globalStyles} from "../assets/styles/globalStyles";
import Checkbox from "expo-checkbox";
import {db} from "../config/firebase";
import {addDoc, collection, updateDoc} from "firebase/firestore";
import {AuthenticatedUserContext} from "../navigation/AuthenticatedUserProvider";
import {addressToCords, uploadImage} from "../utils/GlobalFuncitions";
import CustomDatePicker from "../components/CustomDatePicker";
import ImagePicker from "../components/ImagePicker";
import MyButton from "../components/MyButton";
import {GooglePlacesAutocomplete} from "react-native-google-places-autocomplete";
import Constants from "expo-constants";

/**
 * create a page where the user fills a form
 * on submitting, the user returns to previouse screen,
 * and a listener uploads the data to fire base as js object
 * @returns <form>
 */

export default function PostStation(props) {
    const {user} = useContext(AuthenticatedUserContext);
    const googleAddress = useRef();

    // const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [shadowed, setShadowed] = useState(false);
    const [timeSlots, setTimeSlots] = useState([{start: new Date(), end: new Date()}]);
    const [image, setImage] = useState(null);
    const [cords, setCords] = useState(null);
    const [processing, setProcessing] = useState(false);

    async function buttonPost() {
        setProcessing(true);
        // console.log(googleAddress.current.getAddressText());
        // console.log(googleAddress.current.getCurrentLocation());
        // const cords = await addressToCords(address);
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
        <TouchableWithoutFeedback
            // onPress={Keyboard.dismiss}
        >
            {/*<ScrollView style={{backgroundColor: 'white'}}>*/}
            <View style={[globalStyles.container, {paddingTop: 60}]}>
                <Text style={globalStyles.title}>Station Details</Text>
                {/*<TextInput*/}
                {/*    style={globalStyles.text_input}*/}
                {/*    onChangeText={(text) => setAddress(text)}*/}
                {/*    placeholder="Address"*/}
                {/*/>*/}

                <GooglePlacesAutocomplete
                    ref={googleAddress}
                    placeholder={"Address"}
                    styles={{
                        container: {
                            flex: 0,
                            width: '80%',
                        },
                        textInput: {
                            borderBottomWidth: 1,
                            borderColor: "gray",
                            margin: 2,
                            padding: 5,
                        },


                        listView: {
                            position: "absolute",
                            zIndex: 2,
                            top: 46,
                            borderBottomWidth: 1,
                        },
                        row: {
                            backgroundColor: 'white'
                        },
                    }}
                    nearbyPlacesAPI={"GooglePlacesSearch"}
                    debounce={400}
                    query={{
                        key: Constants.manifest.extra.googleMapsApi,
                        language: 'en-he',
                    }}
                    onPress={(data, details = null) => {
                        setCords(details.geometry.location);
                        console.log(details.geometry.location)
                        console.log(details.name)
                    }
                    } fetchDetails={true}
                />

                <ScrollView keyboardShouldPersistTaps={'handled'}>
                    <View style={globalStyles.container}>
                        <TextInput
                            style={globalStyles.text_input}
                            onChangeText={(text) => setPrice(text)}
                            placeholder="Price per hour"
                            keyboardType={"number-pad"}
                        />
                        <CustomDatePicker timeSlots={timeSlots} setTimeSlots={setTimeSlots}/>


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

            </View>
        </TouchableWithoutFeedback>
    );
}
