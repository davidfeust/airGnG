import React, { useState } from "react";
import {
    Alert,
    Button,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import StationCard from "./StationCard";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import Checkbox from "expo-checkbox";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { globalStyles } from "../assets/styles/globalStyles";
import { onCall } from "../utils/GlobalFuncitions";
import { colors } from "../assets/styles/colors";

export default function MyStationCard({
    owner,
    address,
    date,
    price,
    image,
    onDelete,
    id,
    onEdit,
    available,
    phone,
}) {
    const [innerAvailable, setInnerAvailable] = useState(available);

    const editAvailable = async (value) => {
        setInnerAvailable(value);
        const postRef = doc(db, "postedStation", id);
        await updateDoc(postRef, {
            available: value,
        });
    };

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
                    <Checkbox
                        style={globalStyles.checkbox}
                        value={innerAvailable}
                        onValueChange={(value) => editAvailable(value)}
                    />
                    <Text style={globalStyles.checkbox_label}>available</Text>
                </View>
                <View style={globalStyles.flex_container}>
                    {onEdit != null ? (
                        <TouchableOpacity
                            style={{ margin: 15 }}
                            onPress={() => onEdit(id)}
                        >
                            <MaterialCommunityIcons
                                name="pencil"
                                size={30}
                                color={colors.primary}
                            />
                        </TouchableOpacity>
                    ) : null}

                    {onDelete != null ? (
                        <TouchableOpacity
                            style={{ margin: 15 }}
                            onPress={onDelete}
                        >
                            <MaterialCommunityIcons
                                name="trash-can"
                                size={30}
                                color={colors.primary}
                            />
                        </TouchableOpacity>
                    ) : null}

                    {phone != null ? (
                        <TouchableOpacity
                            style={{ margin: 15 }}
                            onPress={() => onCall(phone)}
                        >
                            <MaterialCommunityIcons
                                name="phone"
                                size={30}
                                color={colors.primary}
                            />
                        </TouchableOpacity>
                    ) : null}
                </View>
            </StationCard>
        </View>
    );
}
