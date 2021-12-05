import React, {useState} from "react";
import {Text, TouchableOpacity, View} from "react-native";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import {colors} from "../assets/styles/colors";

import TimeSlot from "./TimeSlot";

export default function CustomDatePicker() {

    const [timeSlots, setTimeSlots] = useState([{start: null, end: null}]);

    const removeTimeSlot = (key) => {
        const newVal = timeSlots.filter((ts, idx) => key != idx);
        setTimeSlots(newVal);
    };

    const addTimeSlot = () => {
        const temp = [...timeSlots];
        temp.push({start: null, end: null});
        setTimeSlots(temp);
    };

    const inputHandler = (key, s, e) => {
        const temp = [...timeSlots];
        temp[key].start = s;
        temp[key].end = e;
        setTimeSlots(temp);
    }

    return (
        <View>
            {timeSlots.map((ts, key) => (
                <View key={key} style={{
                    flexDirection: "row",
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingHorizontal: 20,
                }}>
                    <TimeSlot index={key} set={inputHandler} time={timeSlots[key]}/>
                    <TouchableOpacity onPress={() => removeTimeSlot(key)}>
                        <MaterialCommunityIcons
                            name="minus-circle"
                            color={colors.primary}
                            size={30}
                        />
                    </TouchableOpacity>
                </View>
            ))}
            <TouchableOpacity
                onPress={addTimeSlot}
                style={{alignSelf: "center", flexDirection: 'row', alignItems: 'center'}}
            >
                <Text style={{paddingHorizontal: 10}}>Add time slot</Text>
                <MaterialCommunityIcons
                    name="plus-circle"
                    color={colors.primary}
                    size={30}
                />
            </TouchableOpacity>
        </View>
    );
}
