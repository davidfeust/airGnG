import React, { useState } from 'react';
import { StyleSheet, Button} from "react-native";
import { ScrollView } from 'react-native-gesture-handler';
import StationCard from '../components/StationCard';

/**
 * create a page with all available stations in the DB,
 * and a button for each to represent subscribing to station.
 * and a listener to that button so the station gets orderd.
 * as soon as the user subscribed for a station,
 * it should be marked as unavailable and removed from this screen
 * @returns <ScrollView>
 */
export default function SubscribeStation() {
    
    const cards = [<StationCard
        owner='Yossi'
        date='30/9/1996'
        address='Elkana, Turey Zahav 38'
        price={20}
        image='https://reactnativeelements.com/img/website/logo.png'/>,
      <StationCard
        owner='Yossi'
        date='30/9/1996'
        address='Elkana, Turey Zahav 38'
        price={20}
        image='https://reactnativeelements.com/img/website/logo.png'/>,
      <StationCard
        owner='Yossi'
        date='30/9/1996'
        address='Elkana, Turey Zahav 38'
        price={20}
        image='https://reactnativeelements.com/img/website/logo.png'/>,
      <StationCard
        owner='ravid'
        date='30/9/1996'
        address='Elkana, Turey Zahav 38'
        price={20}
        image='https://reactnativeelements.com/img/website/logo.png'/>]
    return (
        <ScrollView style={styles.replaceMe}>
            {cards}
            {/* <Button title='press' onPress={()=>console.log(temp)}/> */}
        </ScrollView> );
}

const styles = StyleSheet.create({
    // replaceMe:{alignItems:'center',},
});