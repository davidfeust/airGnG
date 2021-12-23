import React from "react";
import {Text, TouchableOpacity, View} from "react-native";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import {colors} from "../assets/styles/colors";
import TimeSlot from "./TimeSlot";
import {getStartAndEndTime} from "../utils/GlobalFuncitions";

export default function CustomDateManager({setTimeSlots, timeSlots}) {


    const removeTimeSlot = (key) => {
        const newVal = timeSlots.filter((ts, idx) => key !== idx);
        setTimeSlots(newVal);
    };

    const addTimeSlot = () => {
        const temp = [...timeSlots];
        temp.push(getStartAndEndTime());
        setTimeSlots(temp);
    };

    const inputHandler = (key, s, e) => {
        const temp = [...timeSlots];
        if (s) {
            if (s > temp[key].end) {
                // start time is after end time
                var newEnd = new Date(s);
                newEnd.setHours(s.getHours() + 1)
                temp[key].end = newEnd;
            }
            temp[key].start = s;
        }
        if (e) {
            if (temp[key].start > e) {
                // end time is before start time
                var newStart = new Date(e);
                newStart.setHours(e.getHours() - 1)
                temp[key].start = newStart;
            }
            temp[key].end = e;
        }
        temp[key].ordered = false; // add to know if the owner can cancle the time/station
        setTimeSlots(temp);
    }

    return <View style={{width: '100%' }}>
        {timeSlots ? timeSlots.map((ts, key) => (
            <View key={key} style={{
                flexDirection: "row",
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingHorizontal: 40,
                width: '100%'
            }}>
                <TimeSlot index={key} start={timeSlots[key].start} end={timeSlots[key].end} set={inputHandler}/>

                <TouchableOpacity onPress={() => removeTimeSlot(key)} disabled={timeSlots.length === 1}>
                    <MaterialCommunityIcons
                        name="minus-circle"
                        color={timeSlots.length !== 1 ? colors.primary : colors.invalid}
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
