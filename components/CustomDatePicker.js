import React, { useState } from "react";
import { View, Button, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { colors } from "../assets/styles/colors";

import TimeSlot from "./TimeSlot";
import { globalStyles } from "../assets/styles/globalStyles";

export default function CustomDatePicker() {
  const removeTimeSlot = (toRemove) => {
    const newVal = timeSlots.filter((ts) => ts != toRemove);
    console.log(newVal);
    setTimeSlots(newVal);
  };
  const [timeSlots, setTimeSlots] = useState([<TimeSlot />]);

  const addTimeSlot = () => {
    setTimeSlots([...timeSlots, <TimeSlot />]);
  };

  return (
    <View>
      {timeSlots.map((ts, idx) => (
        <View key={idx} style={{ flexDirection: "row" }}>
          {ts}
          <TouchableOpacity onPress={() => removeTimeSlot(ts)}>
            <MaterialCommunityIcons
              name="minus-circle"
              color={colors.primary}
              size={30}
            />
          </TouchableOpacity>
        </View>
      ))}
      <TouchableOpacity onPress={addTimeSlot} style={{ alignSelf: "center" }}>
        <MaterialCommunityIcons
          name="plus-circle"
          color={colors.primary}
          size={30}
        />
      </TouchableOpacity>
    </View>
  );
}
