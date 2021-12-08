import React from 'react';
import { StyleSheet, View } from 'react-native';
import {GooglePlacesAutocomplete} from "react-native-google-places-autocomplete";
import Constants from "expo-constants";


export default function Autocomplete({reference, setCords}) {

    return (
        <GooglePlacesAutocomplete
            ref={reference}
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
            }}
            fetchDetails={true}
        />

    );
}