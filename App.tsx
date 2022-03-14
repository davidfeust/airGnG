import React from "react";
import WrapProviders from "./providers/WrapProviders";
import {LogBox} from "react-native";


LogBox.ignoreLogs(["Setting a timer"]);
LogBox.ignoreLogs(["AsyncStorage"]);

export default function App() {
    return <WrapProviders/>;
}



