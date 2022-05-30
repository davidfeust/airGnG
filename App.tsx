import React from 'react';
import WrapProviders from './providers/WrapProviders';
import { LogBox } from 'react-native';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import Constants from 'expo-constants';
import WSEvents from './utils/WebSocketEvents';

LogBox.ignoreLogs(['Setting a timer']);
LogBox.ignoreLogs(['AsyncStorage']);

var ws = new WebSocket(Constants.manifest.extra.webSocket);
export const observer = new WSEvents();

ws.onmessage = (e) => {
    // a message was received
    observer.post(e);
    console.log(e.data);
};
export default function App() {
    return (
        <NavigationContainer>
            <WrapProviders />
        </NavigationContainer>
    );
}
