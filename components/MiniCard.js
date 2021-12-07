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
    const stretchAnim = useRef(new Animated.Value(100)).current; // Initial
    const [cardStyle, setCardStyle] = useState(style);
    const card = useRef();
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

    const onSelectingCard = () => {
        setCardStyle({ ...cardStyle, position: "absolute" });
        Animated.timing(stretchAnim, {
            toValue: 0,
            duration: 500,
            isInteraction: true,
            useNativeDriver: true,
        }).start();
    };
    useEffect(() => {
        Animated.timing(stretchAnim, {
            toValue: 0,
            duration: 500,
            isInteraction: true,
            useNativeDriver: true,
        }).start();
    }, [stretchAnim]);

    return (
        <Animated.View
            style={[cardStyle, { top: stretchAnim }]}
            ref={card.current}
        >
            <TouchableOpacity onPress={onSelectingCard}>
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
                <Animated.View
                    style={{
                        flexDirection: "column",
                        marginLeft: 10,
                        flex: 1,
                    }}
                >
                    <Animated.Text style={{ flexWrap: "wrap" }}>
                        {address}
                    </Animated.Text>
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
                </Animated.View>
            </TouchableOpacity>
        </Animated.View>
    );
}
