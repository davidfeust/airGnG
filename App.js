import React from "react";
import { View, StyleSheet } from "react-native";
import StationCard from "./components/StationCard";
import Routes from "./navigation";
import SubscribeStation from "./screens/SubscribeStation";

export default function App() {
  return (
    // <Routes/>
    <View style={{flex:1, justifyContent:'center'}}>
        <SubscribeStation/>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    }
    , title: {
        fontSize: 30,
    }
});
