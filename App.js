import React from 'react';
import WrapProviders from './providers/WrapProviders';
import { LogBox, View } from 'react-native';
import { AirbnbRating} from 'react-native-ratings';
import UploadPicture from './components/UploadPicture';
import Ratings from './components/Ratings';
import { AuthenticatedUserProvider } from './providers/AuthenticatedUserProvider';

LogBox.ignoreLogs(['Setting a timer']);
LogBox.ignoreLogs(['AsyncStorage']);

export default function App() {
 
    return <WrapProviders />;
    
}
