import React, { useContext, useState, useRef, useEffect } from "react";
import { View, Text, Image, Animated } from "react-native";
import { AuthenticatedUserContext } from "../navigation/AuthenticatedUserProvider";
import { db } from "../config/firebase";
import { collection, addDoc } from "firebase/firestore";

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
    // const stretchAnim = useRef(new Animated.Value(100)).current; // Initial
    const card = useRef();

    return (
        <View 
            style={style}
            ref={card.current}
        >
          
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
                   
                </View>
           
        </View>
    );
}
