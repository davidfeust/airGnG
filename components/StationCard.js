import React, {useRef, useState} from "react";
import {View, Text, StyleSheet, Button, Image,Alert} from "react-native";
import {Card} from "react-native-elements";
import {CheckBox} from "react-native-elements/dist/checkbox/CheckBox";

/**
 * this component contains all the station data
 * (owner, date, location, price, available? ect.)
 * @returns <div>
 */
export default function StationCard({owner, address, date, price, image, children}) {

    return (
        <Card style={styles.replaceMe}>
            <Card.Title>{owner}</Card.Title>
            <Card.Divider orientation="horizontal"/>
            <Text>{date}</Text>
            <Text>{address}</Text>
            <Text>price: {price} nis</Text>
            {/* <Card.Image source={{ uri: { image } }}></Card.Image> */}
            {children}
        </Card>
    );
}

const styles = StyleSheet.create({
    replaceMe: {
        alignItems: "center",
        textAlign: "center",
        display: "flex",
    },
    centerText: {
        textAlign: "center",
    },
});
