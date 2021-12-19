import React from "react";
import { StyleSheet, Text } from "react-native";
import { Card } from "react-native-elements";
import { dateToString } from "../utils/GlobalFuncitions";

/**
 * this component contains all the station data
 * (owner, date, location, price, available? ect.)
 * @returns <div>
 */
export default function StationCard({
    owner,
    address,
    date,
    price,
    image,
    dateStart,
    dateFinish,
    children,
    imageStyle,
    style,
}) {
    return (
        <Card containerStyle={style}>
            <Card.Title>{address}</Card.Title>
            <Card.Title>{dateStart}-{dateFinish}</Card.Title>
            <Card.Divider orientation="horizontal" />

            {date && date.constructor === Array
                ? date.map((slot, index) => (
                      <Text key={index}>
                          {dateToString(slot.start.toDate())} -{" "}
                          {dateToString(slot.end.toDate())}
                      </Text>
                  ))
                : null}

            <Text>owner: {owner}</Text>
            <Text>price: {price} nis</Text>

            {image !== undefined && (
                <Card.Image style={imageStyle} source={{ uri: image }} />
            )}
            {children}
        </Card>
    );
}

const styles = StyleSheet.create({});
