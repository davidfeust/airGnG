import {MaterialCommunityIcons} from "@expo/vector-icons";
import React, {useState} from "react";
import {Platform, Text, TouchableOpacity, View} from "react-native";
import {colors} from "../assets/styles/colors";
import {dateToString} from "../utils/GlobalFuncitions";
import DateTimePicker from "@react-native-community/datetimepicker";

const PickTime = ({set, time, identifyRange, index, minTime = null}) => {

    const [mode, setMode] = useState("date");
    const [show, setShow] = useState(false);

    const onChange = (event, selectedDate) => {
        if (event.type === 'dismissed') {
            return;
        }
        setShow(Platform.OS === "ios");
        if (mode === "date") {
            const currentDate = selectedDate || time;
            if (identifyRange === 'start') {
                set(index, currentDate, null);
            } else {
                set(index, null, currentDate);
            }
            setMode("time");
            setShow(Platform.OS !== "ios");
        } else {
            const currentDate = selectedDate || time;
            if (identifyRange === 'start') {
                set(index, currentDate, null);
            } else {
                set(index, null, currentDate);
            }
        }
        // date.getDate !== null ? showTimepicker : null;
    };

    const showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);
    };

    const showDatepicker = () => {
        showMode("date");
    };

    return (
        <View>
            <View style={{
                width: '100%',
                alignItems: "center",
                paddingHorizontal: 10,
                paddingVertical: 4,
                justifyContent: 'center'
            }}>
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        width: "100%",
                    }}
                >
                    <Text style={{alignSelf: 'center'}}>
                        {identifyRange}:{'\t\t'} {time ? dateToString(time) : ''}
                    </Text>
                    <TouchableOpacity onPress={showDatepicker}>
                        <MaterialCommunityIcons
                            name="calendar"
                            color={colors.primary}
                            size={30}
                        />
                    </TouchableOpacity>
                </View>

            </View>
            {show && (
                <DateTimePicker
                    testID="dateTimePicker"
                    value={time}
                    mode={mode}
                    is24Hour={true}
                    display="default"
                    onChange={onChange}
                    minimumDate={minTime}
                    minuteInterval={15}
                />
            )}
        </View>
    );
};
export default PickTime;
