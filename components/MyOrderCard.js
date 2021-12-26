import React, {useContext, useEffect, useState} from "react";
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import {globalStyles} from "../assets/styles/globalStyles";
import {dateToString, onCall} from "../utils/GlobalFuncitions";
import {colors} from "../assets/styles/colors";
import {Card} from "react-native-elements";
import {doc, getDoc} from "firebase/firestore";
import {db} from "../config/firebase";
import TimeSlot from "./TimeSlot";
import {AuthenticatedUserContext} from "../providers/AuthenticatedUserProvider";

export default function MyOrderCard({
                                        date_of_sub,
                                        payed,
                                        reservation, // = { start_date:{firebase date type...} , finish_date:{firebase date type...}}
                                        station_id,
                                        sub_car_type,
                                        sub_id,
                                        order_id,
                                        onCancel,
                                    }) {
    //the order user details
    const {user} = useContext(AuthenticatedUserContext);

    // stores the order's station details
    const [stationOrdered, setStationOrdered] = useState(null);

    // stores the order's owner details
    const [stationOwner, setStationOwner] = useState(null);

    useEffect(() => {
        // update station details from db
        getDoc(doc(db, "stations", station_id)).then((d) =>
            setStationOrdered(d.data())
        );
    }, []);

    useEffect(() => {
        // update owner details from db
        stationOrdered &&
        getDoc(doc(db, "users", stationOrdered.owner_id)).then((d) => {
            setStationOwner(d.data());
        });
    }, [stationOrdered]);

    return (
        <View>
            {stationOrdered && stationOwner && (
                <Card>
                    {/* address */}
                    <Card.Title>address: {stationOrdered.address}</Card.Title>
                    {/* order date */}
                    <Card.Title>
                        oredered on: {dateToString(date_of_sub.toDate())}
                    </Card.Title>
                    <View
                        style={{
                            flex: 1,
                            flexDirection: "row",
                            justifyContent: "space-between",
                        }}
                    >
                        {/* owner name if exists... */}
                        {stationOwner.name && (
                            <Card.Title>owner: {stationOwner.name}</Card.Title>
                        )}
                        {/* the order user name if exists... */}
                        {user.name && (
                            <Card.Title>ordered by: {user.name}</Card.Title>
                        )}
                    </View>

                    <Card.Divider orientation="horizontal"/>

                    {/* reservation details */}
                    <TimeSlot
                        start={reservation.date_start.toDate()}
                        end={reservation.date_finish.toDate()}
                        index={0}
                    />

                    {/* is it payed already? */}
                    <Text>payed: {String(payed)}</Text>

                    {/* calculated price */}
                    <Text>
                        price:{" "}
                        {((reservation.date_finish.toDate() -
                                reservation.date_start.toDate()) /
                            36e5) *
                        stationOrdered.price}{" "}
                        nis
                    </Text>

                    {/* car type. we might erase this field in the future */}
                    <Text>car type: {sub_car_type}</Text>

                    {/* image */}
                    {stationOrdered.image !== undefined && (
                        <Card.Image source={{uri: stationOrdered.image}}/>
                    )}

                    {/* buttons */}
                    <View style={globalStyles.flex_container}>
                        {/* CANCEL */}
                        {onCancel && (
                            <TouchableOpacity
                                style={styles.icon}
                                onPress={() => onCancel(order_id)}
                            >
                                <MaterialCommunityIcons
                                    name="trash-can"
                                    size={30}
                                    color={colors.primary}
                                />
                                <Text style={styles.explain}>Cancel Order</Text>
                            </TouchableOpacity>
                        )}

                        {/* PHONE button to call the station owner */}
                        {stationOwner.phone ? (
                            <TouchableOpacity
                                style={styles.icon}
                                onPress={() => onCall(stationOwner.phone)}
                            >
                                <MaterialCommunityIcons
                                    name="phone"
                                    size={30}
                                    color={colors.primary}
                                />
                                <Text style={styles.explain}>
                                    call the owner
                                </Text>
                            </TouchableOpacity>
                        ) : null}
                    </View>
                </Card>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    icon: {
        margin: 15,
        alignItems: "center",
    },
    explain: {
        marginTop: 3,
        width: 70,
        textAlign: "center",
    },
});
