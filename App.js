import React from 'react';
import {StyleSheet} from 'react-native';
import Routes from "./navigation";
import TT from "./screens/TT";


export default function App() {
    return (
        <Routes/>
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
