import {MaterialCommunityIcons} from "@expo/vector-icons";
import React, {useState} from "react";
import {Text, TouchableOpacity, View} from "react-native";
import DatePicker from "react-native-neat-date-picker";
import {colors} from "../assets/styles/colors";
import {globalStyles} from "../assets/styles/globalStyles";
import {dateToString} from '../utils/GlobalFuncitions';

const TimeSlot = ({index, set, time}) => {
    const [showDatePicker, setShowDatePicker] = useState(false);

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
