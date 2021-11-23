import React, {useState} from 'react';
import {Alert, Button, StyleSheet, Text, View} from 'react-native';
import StationCard from "./StationCard";
import { doc, deleteDoc } from "firebase/firestore";
import {db} from "../config/firebase";


export default function MyStationCard({owner, address, date, price, image, onDelete, id}) {
    // const [id, setId] = useState('');

    const OnEdit = () => {

    }

    return (
        <View>
            <StationCard
                owner={owner}
                address={address}
                price={price}
                image={image}
                date={date}>
                <Button title="edit" onPress={() => OnEdit()}/>
                <Button title="delete" onPress={() => onDelete(id)}/>
            </StationCard>
        </View>
    );
}

const styles = StyleSheet.create({});