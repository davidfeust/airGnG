import {MaterialCommunityIcons} from "@expo/vector-icons";
import React, {useEffect, useRef, useState} from "react";
import {View, Text, TouchableOpacity, Date} from "react-native";
import DatePicker from "react-native-neat-date-picker";
import {colors} from "../assets/styles/colors";
import {globalStyles} from "../assets/styles/globalStyles";

const TimeSlot = ({index, set, time}) => {
    const [showDatePicker, setShowDatePicker] = useState(false);

    const dateToString = (date) => {
        return date.getDate() + "/" + date.getMonth() + "/" + date.getYear();
    };

    const openDatePicker = () => {
        setShowDatePicker(true);
    };

    const onCancel = () => {
        // You should close the modal in here
        setShowDatePicker(false);
    };

    const onConfirm = (start, end) => {
        // You should close the modal in here
        setShowDatePicker(false);
        set(index, start, end);
    };

    return (
        <View style={{width: '80%', alignItems: 'center'}}>
            <View style={[globalStyles.text_input,
                {flexDirection: 'row', justifyContent: "space-between", width: '100%'}]}>
                <Text>
                    {time.start ? dateToString(time.start) : "start"} - {time.end ? dateToString(time.end) : "finish"}
                </Text>
                <TouchableOpacity onPress={openDatePicker}>
                    <MaterialCommunityIcons
                        name="calendar"
                        color={colors.primary}
                        size={30}
                    />
                </TouchableOpacity>
            </View>


            <DatePicker
                onConfirm={onConfirm}
                isVisible={showDatePicker}
                mode={"range"}
                onCancel={onCancel}
            />
        </View>
    );
};

export default TimeSlot;
