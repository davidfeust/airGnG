import React, { useContext, useState, useRef, useEffect } from "react";
import { View, Text, Image, Animated } from "react-native";
import { AuthenticatedUserContext } from "../navigation/AuthenticatedUserProvider";
import { db } from "../config/firebase";
import { collection, addDoc  } from "firebase/firestore";
import TimeSlot from "./TimeSlot";
import { TouchableOpacity } from "react-native-gesture-handler";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { colors } from "../assets/styles/colors";
import { globalStyles } from "../assets/styles/globalStyles";

export default function MaxiCard({
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

    useEffect(() => {
        Animated.timing(stretchAnim, {
            toValue: 400,
            duration: 500,
            useNativeDriver: false,
        }).start();
    }, [stretchAnim]);

    return (
        <Animated.View
            style={[
                style,
                {
                    height: stretchAnim,
                },
            ]}
            ref={card.current}
        >
            <View>
                <Image
                    source={
                        image
                            ? { uri: image }
                            : require("../assets/defaults/default_image.png")
                    }
                    style={{ width: 300, height: 200, alignSelf: "center" }}
                />
                <Text style={{ flexWrap: "wrap", color: "red" }}>
                    {address}
                </Text>
                <Text>{owner}</Text>
                <Text>{price} nis</Text>

                {date? date.map((d,index)=>(<TimeSlot key={index} start={ d.start.toDate()} end={d.end.toDate()} index={index}/>) ) : null}
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
        </Animated.View>
    );
}
