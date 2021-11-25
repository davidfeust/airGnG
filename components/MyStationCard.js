import React, {useState} from 'react';
import {Alert, Button, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import StationCard from "./StationCard";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import {db} from "../config/firebase";
import Checkbox from "expo-checkbox";
import {MaterialCommunityIcons} from "@expo/vector-icons";


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

                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                    <TouchableOpacity>
                        <MaterialCommunityIcons style={{textAlign:'center',}} name={'pencil'} color={'black'} size={26}/>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <MaterialCommunityIcons style={{textAlign:'center',}} name={'delete'} color={'black'} size={26}/>
                    </TouchableOpacity>
                </View>


                <Button title="edit" onPress={() => onEdit(id)}/>
                <Button title="delete" onPress={() => onDelete(id)}/>
            </StationCard>
        </View>
    );
}


const styles = StyleSheet.create({});
