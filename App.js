import React, { useEffect } from 'react';
import WrapProviders from './providers/WrapProviders';
import { LogBox } from 'react-native';
import { logHelloWorld } from './config/firebase';

LogBox.ignoreLogs(['Setting a timer']);
LogBox.ignoreLogs(['AsyncStorage']);

export default function App() {
    return <WrapProviders />;
}
