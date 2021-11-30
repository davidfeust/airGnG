import React, { useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import StationCard from "./StationCard";
import { CheckBox } from "react-native-elements/dist/checkbox/CheckBox";
import { globalStyles } from "../assets/styles/globalStyles";
import MyButton from "./MyButton";

export default function PublicStationCard({
  owner,
  address,
  date,
  price,
  image,
  id,
  style,
}) {
  const [isAvailable, setIsAvailable] = useState(true);

  const OnOrder = (e) => {
    setIsAvailable(!isAvailable);
  };

  return (
    <View style={style}>
      <StationCard
        owner={owner}
        address={address}
        price={price}
        image={image}
        date={date}
        imageStyle={globalStyles.mini_card_image_style}
      >
        <CheckBox className="check" title="available" checked={isAvailable}>
          available
        </CheckBox>
        {isAvailable ?
            <View style={{alignItems: 'center'}}>
              <MyButton text="order" onPress={OnOrder} />
            </View>
            : null}
      </StationCard>
    </View>
  );
}