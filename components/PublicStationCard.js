import React, {useContext, useState} from "react";
import {View} from "react-native";
import StationCard from "./StationCard";
import {globalStyles} from "../assets/styles/globalStyles";
import MyButton from "./MyButton";
import {AuthenticatedUserContext} from "../providers/AuthenticatedUserProvider";

// TODO: Check if that component is not necessary
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
    const onOrder = async () => {
        const newOrder = {
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
        };
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
