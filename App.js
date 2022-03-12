import React from 'react';
import WrapProviders from './providers/WrapProviders';
import { LogBox, View } from 'react-native';
import { AirbnbRating, Rating } from 'react-native-ratings';
import UploadPicture from './components/UploadPicture';

LogBox.ignoreLogs(['Setting a timer']);
LogBox.ignoreLogs(['AsyncStorage']);

export default function App() {
 
    return <WrapProviders />;
    //  return <UploadPicture fullPath={"images_profiles/deleteMe.jpg"}/>;

}
