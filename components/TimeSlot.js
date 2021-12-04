import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { View, Text, TouchableOpacity, Date } from "react-native";
import DatePicker from "react-native-neat-date-picker";
import { colors } from "../assets/styles/colors";

const TimeSlot = () => {
    const [sdate, setSdate] = useState(null);
    const [fdate, setFdate] = useState(null);

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

        // The parameter 'date' is a Date object so that you can use any Date prototype method.
        setSdate(start);
        setFdate(end);
    };

    return (
        <View
            style={{
                flexDirection: "row",
                justifyContent: "space-between",
            }}
        >
            <Text>
                {sdate ? dateToString(sdate) : "start"}-
                {sdate ? dateToString(fdate) : "finish"}
            </Text>
            <TouchableOpacity onPress={openDatePicker}>
                <MaterialCommunityIcons
                    name="calendar"
                    color={colors.primary}
                    size={30}
                />
            </TouchableOpacity>
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
