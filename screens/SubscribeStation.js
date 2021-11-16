import React, { useState } from 'react';
import { StyleSheet} from "react-native";
import { ScrollView } from 'react-native-gesture-handler';

/**
 * create a page with all available stations in the DB,
 * and a button for each to represent subscribing to station.
 * and a listener to that button so the station gets orderd.
 * as soon as the user subscribed for a station,
 * it should be marked as unavailable and removed from this screen
 * @returns <ScrollView>
 */
export default function SubscribeStation() {
    
    return ( <ScrollView style={styles.replaceMe}></ScrollView> );
}

const styles = StyleSheet.create({
    replaceMe:{alignItems:'center',},
});