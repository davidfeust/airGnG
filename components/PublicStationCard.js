import React, {useContext, useState} from "react";
import {Button, StyleSheet, Text, View} from "react-native";
import StationCard from "./StationCard";
import {CheckBox} from "react-native-elements/dist/checkbox/CheckBox";
import {globalStyles} from "../assets/styles/globalStyles";
import MyButton from "./MyButton";
import {AuthenticatedUserContext} from "../navigation/AuthenticatedUserProvider";
import {db} from "../config/firebase";
import {collection, addDoc} from "firebase/firestore";

export default function PublicStationCard({
                                              owner,
                                              address,
                                              date,
                                              price,
                                              image,
                                              id,
                                              style,
                                          }) {
    const {user} = useContext(AuthenticatedUserContext);
    const [isAvailable, setIsAvailable] = useState(true);
    const onOrder = () => {
        addDoc(collection(db, "subscriptions"), {
            sub_id: user.uid,
            date_of_sub: new Date(),
            reservation: {
                date_start: "the subscriber needs to choose a date when he/she orders",
                date_finish: "same here",
            },
            station_id: id,
            payed: false,
            sub_car_type:
                "the user might have an incompetible type of charge for his card",
        })
            .catch((e) => console.error("Error adding document: ", e));
    };

    return (
        <View>
            <StationCard
                owner={owner}
                address={address}
                price={price}
                image={image}
                date={date}
                imageStyle={globalStyles.mini_card_image_style}
                style={style}
            >
                {/* <CheckBox className="check" title="available" checked={isAvailable}>
          available
        </CheckBox> */}

                <View style={{alignItems: "center"}}>
                    <MyButton text="order" onPress={onOrder}/>
                </View>
            </StationCard>
        </View>
    );
}
