import React from "react";
import {TouchableOpacity, View,} from "react-native";
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
                        style={{margin: 15}}
                        onPress={() => onEdit(id)}
                    >
                        <MaterialCommunityIcons
                            name="pencil"
                            size={30}
                            color={colors.primary}
                        />
                    </TouchableOpacity>
                    }

                    {/* DELETE */}
                    {onDelete &&
                    <TouchableOpacity
                        style={{margin: 15}}
                        onPress={() => onDelete(id)}
                    >
                        <MaterialCommunityIcons
                            name="trash-can"
                            size={30}
                            color={colors.primary}
                        />
                    </TouchableOpacity>
                    }

                    {/* PHONE */}
                    {phone &&
                    <TouchableOpacity
                        style={{margin: 15}}
                        onPress={() => onCall(phone)}
                    >
                        <MaterialCommunityIcons
                            name="phone"
                            size={30}
                            color={colors.primary}
                        />
                    </TouchableOpacity>
                    }

                    {/* PUBLISH */}
                    {onGoToPublish && <TouchableOpacity
                        style={{margin: 15}}
                        onPress={onGoToPublish}
                    >
                        <MaterialCommunityIcons
                            name="clock"
                            size={30}
                            color={colors.primary}
                        />
                    </TouchableOpacity>}


                </View>
            </StationCard>
        </View>
    );
}
