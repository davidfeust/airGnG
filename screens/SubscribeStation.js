import React, { useState } from 'react';
import { StyleSheet, Button} from "react-native";
import { ScrollView } from 'react-native-gesture-handler';
import StationCard from '../components/StationCard';
import {collection,doc, getDoc} from "firebase/firestore";
import {db} from "../config/firebase";


/**
 * create a page with all available stations in the DB,
 * and a button for each to represent subscribing to station.
 * and a listener to that button so the station gets orderd.
 * as soon as the user subscribed for a station,
 * it should be marked as unavailable and removed from this screen
 * @returns <ScrollView>
 */
export default function SubscribeStation() {
    const docRef = collection(db, 'postedStation', 'zhyXdrm6ep136ieMNKnK')
    const docSnap = getDoc(docRef);
    // const cards = getDocs(collection(db, "postedStation", 'SF')).then((val)=>val.docs)
    return (
        <ScrollView style={styles.replaceMe}>
            {/* {cards[0]} */}
            <Button title='press' onPress={(e)=>docSnap.exists? console.log(docSnap.data()):console.log('not found')}/>
        </ScrollView> );
}

const styles = StyleSheet.create({
    // replaceMe:{alignItems:'center',},
});