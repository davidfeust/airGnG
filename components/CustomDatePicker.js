import React from "react";
import {Text, TouchableOpacity, View} from "react-native";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import {colors} from "../assets/styles/colors";
import TimeSlot from "./TimeSlot";

export default function CustomDatePicker({setTimeSlots, timeSlots}) {


    const removeTimeSlot = (key) => {
        const newVal = timeSlots.filter((ts, idx) => key !== idx);
        setTimeSlots(newVal);
    };

    const addTimeSlot = () => {
        const temp = [...timeSlots];
        temp.push({start: new Date(), end: new Date()});
        setTimeSlots(temp);
    };

    const inputHandler = (key, s, e) => {
        const temp = [...timeSlots];
        if (s) {
            temp[key].start = s;
        }
        if (e) {
            temp[key].end = e;
        }
        setTimeSlots(temp);
    }

    return <View style={{width: '100%'}}>
        {timeSlots ? timeSlots.map((ts, key) => (
            <View key={key} style={{
                flexDirection: "row",
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingHorizontal: 40,
                width: '100%'
            }}>
                <TimeSlot index={key} start={timeSlots[key].start} end={timeSlots[key].end} set={inputHandler}/>
                <TouchableOpacity onPress={() => removeTimeSlot(key)}>
                    <MaterialCommunityIcons
                        name="minus-circle"
                        color={colors.primary}
                        size={30}
                    />
                </TouchableOpacity>
            </View>
        )) : null}

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
    </View>;
}
