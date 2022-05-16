import React from 'react';
import WrapProviders from './providers/WrapProviders';
import { LogBox } from 'react-native';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';

LogBox.ignoreLogs(['Setting a timer']);
LogBox.ignoreLogs(['AsyncStorage']);

export default function App() {
    return (
        <NavigationContainer>
            <WrapProviders />
        </NavigationContainer>
    );
}
