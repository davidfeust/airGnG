import React from "react";
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import StationCard from "./StationCard";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import {globalStyles} from "../assets/styles/globalStyles";
import {onCall} from "../utils/GlobalFuncitions";
import {colors} from "../assets/styles/colors";

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
                                          onGoToPublish
                                      }) {

    return (
        <View>
            <StationCard
                owner={owner}
                address={address}
                price={price}
                image={image}
                date={date}
            >

                <View style={globalStyles.flex_container}>

                    {/* EDIT */}
                    {onEdit &&
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
                    }

                    {/* DELETE */}
                    {onDelete &&
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
                    }

                    {/* PHONE */}
                    {phone &&
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
                    }

                    {/* PUBLISH */}
                    {onGoToPublish && <TouchableOpacity
                        style={styles.icon}
                        onPress={onGoToPublish}
                    >
                        <MaterialCommunityIcons
                            name="clock"
                            size={30}
                            color={colors.primary}
                        />
                        <Text style={styles.explain}>publish</Text>
                    </TouchableOpacity>}


                </View>
            </StationCard>
        </View>
    );
}

const styles = StyleSheet.create({
    icon: {
        margin: 15,
        alignItems: 'center'
    },
    explain: {
        marginTop: 3,
        width: 70,
        textAlign: 'center'
    }
});
