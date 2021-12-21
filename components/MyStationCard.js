import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { globalStyles } from "../assets/styles/globalStyles";
import { dateToString, onCall } from "../utils/GlobalFuncitions";
import { colors } from "../assets/styles/colors";
import { Card } from "react-native-elements";

export default function MyStationCard({
    owner,
    address,
    date,
    price,
    image,
    onDelete,
    id,
    onEdit,
    phone,
    dateStart,
    dateFinish,
    onGoToPublish,
}) {
    return (
        <View>
            <Card>
                <Card.Title>{address}</Card.Title>
                <Card.Title>
                    {dateStart}-{dateFinish}
                </Card.Title>
                <Card.Divider orientation="horizontal" />

                {date &&
                    date.map((slot, index) => (
                        <Text key={index}>
                            {dateToString(slot.start.toDate())} -{" "}
                            {dateToString(slot.end.toDate())}
                        </Text>
                    ))}

                <Text>owner: {owner}</Text>
                <Text>price: {price} nis</Text>

                {image !== undefined && <Card.Image source={{ uri: image }} />}
                {/*{children}*/}

                <View style={globalStyles.flex_container}>
                    {/* EDIT */}
                    {onEdit && (
                        <TouchableOpacity
                            style={styles.icon}
                            onPress={() => onEdit(id)}
                        >
                            <MaterialCommunityIcons
                                name="pencil"
                                size={30}
                                color={colors.primary}
                            />
                            <Text style={styles.explain}>edit</Text>
                        </TouchableOpacity>
                    )}

                    {/* DELETE */}
                    {onDelete && (
                        <TouchableOpacity
                            style={styles.icon}
                            onPress={() => onDelete(id)}
                        >
                            <MaterialCommunityIcons
                                name="trash-can"
                                size={30}
                                color={colors.primary}
                            />
                            <Text style={styles.explain}>delete</Text>
                        </TouchableOpacity>
                    )}

                    {/* PHONE // button to call the station owner */}
                    {phone && (
                        <TouchableOpacity
                            style={styles.icon}
                            onPress={() => onCall(phone)}
                        >
                            <MaterialCommunityIcons
                                name="phone"
                                size={30}
                                color={colors.primary}
                            />
                            <Text style={styles.explain}>call the man</Text>
                        </TouchableOpacity>
                    )}

                    {/* PUBLISH */}
                    {onGoToPublish && (
                        <TouchableOpacity
                            style={styles.icon}
                            onPress={onGoToPublish}
                        >
                            <MaterialCommunityIcons
                                name="clock"
                                size={30}
                                color={colors.primary}
                            />
                            <Text style={styles.explain}>publish</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </Card>
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
