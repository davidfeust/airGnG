import opencage from "opencage-api-client";
import Constants from "expo-constants";
import {collection, getDocs} from "firebase/firestore";
import {db, storage} from "../config/firebase";
import * as ImagePicker from "expo-image-picker";
import {getDownloadURL, ref, uploadBytes} from "firebase/storage";
import React, {useState} from "react";
import {Text, TouchableOpacity, View} from "react-native";
import {globalStyles} from "../assets/styles/globalStyles";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import {colors} from "../assets/styles/colors";
import DatePicker from "react-native-neat-date-picker";

export const addressToCords = async (address) => {
    try {
        const res = await opencage.geocode({
            q: address,
            key: Constants.manifest.extra.opencageApiKey,
            no_annotations: 1,
        });
        return res.results[0].geometry;
    } catch (error) {
        console.error(error.toString());
    }
};

export const getFromCol = async (col_name, set_fun) => {
    const col = collection(db, col_name);
    const cards_col = await getDocs(col);
    set_fun(
        cards_col.docs.map((doc) => {
            let id = doc.id;
            let data = doc.data();
            return {id, ...data};
        })
    );
};

export const pickImageLibrary = async (setImage) => {
    const {status} = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
        alert("not permitted");
        return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
    });

    if (!result.cancelled) {
        setImage(result.uri);
    }
};
export const pickImageCamera = async (setImage) => {
    const {status} = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
        alert("not permitted");
        return;
    }
    let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
    });

    if (!result.cancelled) {
        setImage(result.uri);
    }
};

export const uploadImage = async (uri, id) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const storageRef = await ref(storage, `${id}.jpg`);
    await uploadBytes(storageRef, blob);
    return await getDownloadURL(storageRef, `${id}.jpg`);
};

export const dateToString = (date) => {
    return date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes();
};
