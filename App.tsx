import React from 'react';
import WrapProviders from './providers/WrapProviders';
import { LogBox } from 'react-native';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import Constants from 'expo-constants';

LogBox.ignoreLogs(['Setting a timer']);
LogBox.ignoreLogs(['AsyncStorage']);

var ws = new WebSocket(Constants.manifest.extra.webSocket);
ws.onmessage = (e) => {
    // a message was received
    console.log(e.data);
};
export default function App() {
    return (
        <NavigationContainer>
            <WrapProviders />
        </NavigationContainer>
    );
}
