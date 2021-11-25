import React, {useState} from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';
import StationCard from "./StationCard";
import {CheckBox} from "react-native-elements/dist/checkbox/CheckBox";


export default function PublicStationCard({owner, address, date, price, image, id}) {
    const [isAvailable, setIsAvailable] = useState(true);

    const OnOrder = (e) => {
        setIsAvailable(!isAvailable);
        const to_push = {
            owner: owner,
            address: address,
            date: date,
            price: price,
            image: image,
        };
        console.log(to_push);
    };

    return (
        <View>
            <StationCard
                owner={owner}
                address={address}
                price={price}
                image={image}
                date={date}>
                <CheckBox className="check" title="available" checked={isAvailable}>
                    available
                </CheckBox>
               {isAvailable? <Button title="order" onPress={OnOrder}/>:null}
            </StationCard>
        </View>
    );
}

const styles = StyleSheet.create({});