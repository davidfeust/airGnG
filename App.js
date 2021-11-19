import React from 'react';
import {StyleSheet} from 'react-native';
import Routes from "./navigation";
import TT from "./screens/SignUp";
import SignUp from "./screens/SignUp";
import Welcome from "./screens/Welcome";


export default function App() {
    return (
        <Routes/>
        // <SignUp/>
        //  <Welcome/>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
