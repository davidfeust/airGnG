import opencage from "opencage-api-client";
import Constants from "expo-constants";
import { collection, getDocs } from "firebase/firestore";
import { db, storage } from "../config/firebase";
import * as ImagePicker from "expo-image-picker";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import React from "react";
import { Linking, Alert, Platform } from 'react-native';

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
            return { id, ...data };
        })
    );
};

export const pickImageLibrary = async (setImage) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
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
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
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

export const uploadImage = async (uri: string, id: number) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const storageRef = await ref(storage, `${id}.jpg`);
    await uploadBytes(storageRef, blob);
    return await getDownloadURL(storageRef, `${id}.jpg`);
};

export const dateToString = (date: Date) => {
    const zeroPad = (num: number, places: number) =>
        String(num).padStart(places, "0");

    return dateToStringNoHours(date) + dateToStringHours(date);
};
export const dateToStringNoHours = (date: Date) => {
    return (
        date.getDate() +
        "/" +
        (date.getMonth() + 1) +
        "/" +
        date.getFullYear() +
        " "
    );
};


export const onCall = phone => {
  console.log('callNumber ----> ', phone);
  let phoneNumber = phone;
  if (Platform.OS !== 'android') {
    phoneNumber = `telprompt:${phone}`;
  }
  else  {
    phoneNumber = `tel:${phone}`;
  }
  Linking.canOpenURL(phoneNumber)
  .then(supported => {
    if (!supported) {
      Alert.alert('Phone number is not available');
    } else {
      return Linking.openURL(phoneNumber);
    }
  })
  .catch(err => console.log(err));
};



export const dateToStringHours = (date: Date) => {
    const zeroPad = (num, places) => String(num).padStart(places, "0");
    return zeroPad(date.getHours(), 2) + ":" + zeroPad(date.getMinutes(), 2);
};

export function dateRange(start: Date, end: Date, intervalInMinutes: number) {
    var current = new Date(start);
    const etime = end.getTime();
    const intervalInMili = intervalInMinutes * 60 * 1000;
    var res = [];
    while (current.getTime() + intervalInMili < etime) {
        res.push(new Date(current));
        current.setMinutes(current.getMinutes() + intervalInMinutes);
    }
    return res;
}
