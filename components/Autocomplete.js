import React from 'react';
import { StyleSheet, View } from 'react-native';
import {GooglePlacesAutocomplete} from "react-native-google-places-autocomplete";
import Constants from "expo-constants";


export default function Autocomplete({reference, setCords, placeHolder = "Address",setViewPort=null,styleTag="default" }) {
    const defaultStyle = {
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
    }


    const styleSearch = {
        container: {
            flex: 0,
            width: '80%',
        },
        textInput: {
            borderColor: "gray",
            margin: 2,
            padding: 0,
        },
        listView: {
            zIndex: 4,
        },
        row: {
            backgroundColor: 'white'
        },
    }
    // I used styleToUse to implements the right style for the autocomplete component
    let styleToUse = defaultStyle;
    if(styleTag === "styleSearch"){
        styleToUse = styleSearch}

    return (
        <GooglePlacesAutocomplete
            ref={reference}
            placeholder={placeHolder}
            styles={styleToUse}
            // styles={defaultStyle}
            nearbyPlacesAPI={"GooglePlacesSearch"}
            debounce={400}
            query={{
                key: Constants.manifest.extra.googleMapsApi,
                language: 'en-he',
            }}
            onPress={(data, details = null) => {
                // console.log(details);
                setCords(details.geometry.location);
                if(setViewPort!=null){
                    setViewPort(details.geometry.viewport)}
            }}
            fetchDetails={true}
        />

    );

}