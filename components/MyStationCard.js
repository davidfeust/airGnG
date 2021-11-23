import React, {useState} from 'react';
import {Alert, Button, StyleSheet, Text, View} from 'react-native';
import StationCard from "./StationCard";
import { doc, deleteDoc } from "firebase/firestore";
import {db} from "../config/firebase";


export default function MyStationCard({owner, address, date, price, image, onDelete, id, onEdit, available}) {
    const [innerAvailable, setInnerAvailable] = useState(available);

    const editAvailable = async (value) => {
        setInnerAvailable(value)
        const postRef = doc(db, "postedStation", id);
        await updateDoc(postRef, {
            available: value
        });
    }


    return (
        <View>
            <StationCard
                owner={owner}
                address={address}
                price={price}
                image={image}
                date={date}>
                <Text>available</Text>
                <Checkbox value={innerAvailable} onValueChange={value => editAvailable(value)}/>
                <Button title="edit" onPress={() => onEdit(id)}/>
                <Button title="delete" onPress={() => onDelete(id)}/>
            </StationCard>
        </View>
    );
}


const styles = StyleSheet.create({});