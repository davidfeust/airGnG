import { collection, getDocs } from 'firebase/firestore';
import { db, storage } from '../config/firebase';
import * as ImagePicker from 'expo-image-picker';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { Alert, Linking, Platform } from 'react-native';
import { Review } from '../App.d';
export const getFromCol = async (
    col_name: string,
    set_fun: (map: { id: string }[]) => void
) => {
    const col = collection(db, col_name);
    const cards_col = await getDocs(col);
    const map = cards_col.docs.map((doc) => {
        let id = doc.id;
        let data = doc.data();
        return { id, ...data };
    });
    set_fun(map);
    return map;
};

export const pickImageLibrary = async (setImage: (uri: string) => void) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
        alert('not permitted');
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
export const pickImageCamera = async (setImage: (uri: string) => void) => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
        alert('not permitted');
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

export const uploadImage = async (path: string, url: string) => {
    const response = await fetch(path);
    const blob = await response.blob();
    const storageRef = ref(storage, url);
    await uploadBytes(storageRef, blob);
    return await getDownloadURL(storageRef);
};

export const dateToString = (date: Date) => {
    const zeroPad = (num: number, places: number) =>
        String(num).padStart(places, '0');

    return dateToStringNoHours(date) + dateToStringHours(date);
};
export const getAverageRate = (reviews: Review[]): number => {
    if (reviews.length == 0) {
        return 0;
    }
    return reviews.reduce((a, b) => a + b.rating, 0) / reviews.length;
};
export const dateToStringNoHours = (date: Date) => {
    return (
        date.getDate() +
        '/' +
        (date.getMonth() + 1) +
        '/' +
        date.getFullYear() +
        ' '
    );
};

export const getStartAndEndTime = () => {
    const start_date = new Date();
    const end_date = new Date();
    start_date.setMinutes(Math.ceil(start_date.getMinutes() / 30) * 30);
    end_date.setMinutes(Math.ceil(end_date.getMinutes() / 30) * 30 + 60);
    return new Object({ start: start_date, end: end_date });
};

export const onCall = (phone) => {
    let phoneNumber = phone;
    if (Platform.OS !== 'android') {
        phoneNumber = `telprompt:${phone}`;
    } else {
        phoneNumber = `tel:${phone}`;
    }
    Linking.canOpenURL(phoneNumber)
        .then((supported) => {
            if (!supported) {
                Alert.alert('Phone number is not available');
            } else {
                return Linking.openURL(phoneNumber);
            }
        })
        .catch((err) => console.log(err));
};

export const dateToStringHours = (date: Date) => {
    const zeroPad = (num, places) => String(num).padStart(places, '0');
    return zeroPad(date.getHours(), 2) + ':' + zeroPad(date.getMinutes(), 2);
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
