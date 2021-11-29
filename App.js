import React, {useEffect} from "react";
import Routes from "./navigation";
import {LogBox} from "react-native";

LogBox.ignoreLogs(["Setting a timer"]);
LogBox.ignoreLogs(["AsyncStorage"]);

export default function App() {
    return <Routes/>;

}




