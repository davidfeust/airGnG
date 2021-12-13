import React, { useState } from "react";
import {
  Alert,
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import StationCard from "./StationCard";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import Checkbox from "expo-checkbox";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { globalStyles } from "../assets/styles/globalStyles";
import { onCall } from "../utils/GlobalFuncitions";
import MyButton from "./MyButton";

export default function MyStationCard({
  owner,
  address,
  date,
  price,
  image,
  onDelete,
  id,
  onEdit,
  available,
  phone,
}) {
  const [innerAvailable, setInnerAvailable] = useState(available);

  const editAvailable = async (value) => {
    setInnerAvailable(value);
    const postRef = doc(db, "postedStation", id);
    await updateDoc(postRef, {
      available: value,
    });
  };

  return (
    <View>
      <StationCard
        owner={owner}
        address={address}
        price={price}
        image={image}
        date={date}
      >
        <View style={globalStyles.flex_container}>
          <Checkbox
            style={globalStyles.checkbox}
            value={innerAvailable}
            onValueChange={(value) => editAvailable(value)}
          />
          <Text style={globalStyles.checkbox_label}>available</Text>
        </View>
        <View style={globalStyles.flex_container}>
          {onEdit != null ? (
            <View style={globalStyles.in_bt}>
              <MyButton text="edit" onPress={() => onEdit(id)} />
            </View>
          ) : null}
          {onDelete != null ? (
            <View style={globalStyles.in_bt}>
              <MyButton text="delete" onPress={() => onDelete(id)} />
            </View>
          ) : null}
          {phone != null ? (
            <View style={globalStyles.in_bt}>
              <MyButton text="call the man!" onPress={() => onCall(phone)} />
            </View>
          ) : null}
        </View>
      </StationCard>
    </View>
  );
}

const styles = StyleSheet.create({});
