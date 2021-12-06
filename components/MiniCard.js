import React, { useContext, useState } from "react";
import { View, Text, Image } from "react-native";
import StationCard from "./StationCard";
import { globalStyles } from "../assets/styles/globalStyles";
import MyButton from "./MyButton";
import { AuthenticatedUserContext } from "../navigation/AuthenticatedUserProvider";
import { db } from "../config/firebase";
import { collection, addDoc } from "firebase/firestore";
// import { Image } from "react-native-elements";
import { Divider } from "react-native-elements/dist/divider/Divider";
import { TouchableOpacity } from "react-native-gesture-handler";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { colors } from "../assets/styles/colors";

export default function MiniCard({
    owner,
    address,
    date,
    price,
    image,
    id,
    style,
}) {
    const { user } = useContext(AuthenticatedUserContext);
    const onOrder = () => {
        addDoc(collection(db, "subscriptions"), {
            sub_id: user.uid,
            date_of_sub: new Date(),
            reservation: {
                date_start:
                    "the subscriber needs to choose a date when he/she orders",
                date_finish: "same here",
            },
            station_id: id,
            payed: false,
            sub_car_type:
                "the user might have an incompetible type of charge for his card",
        }).catch((e) => console.error("Error adding document: ", e));
    };

    return (
        <View style={[style]}>
            <View>
                <Image
                    source={
                        image
                            ? { uri: image }
                            : require("../assets/defaults/default_image.png")
                    }
                    style={{ width: 100, height: 100 }}
                />
            </View>
            <View
                style={{
                    flexDirection: "column",
                    marginLeft: 10,
                    flex: 1,
                }}
            >
                <Text style={{ flexWrap: "wrap" }}>{address}</Text>
                <Text>{owner}</Text>
                <Text>{price} nis</Text>
                <TouchableOpacity
                    onPress={onOrder}
                    style={{
                        alignSelf: "center",
                        flexDirection: "row",
                        alignItems: "center",
                        backgroundColor: colors.primary,
                        borderRadius: 5,
                    }}
                >
                    <Text style={{ paddingHorizontal: 10, color: "white" }}>
                        order
                    </Text>
                    <MaterialCommunityIcons
                        name="book"
                        color={"white"}
                        size={30}
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
}
