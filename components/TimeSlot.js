import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Text, TouchableOpacity, Button, Platform, View } from "react-native";
import DatePicker from "react-native-neat-date-picker";
import { colors } from "../assets/styles/colors";
import { globalStyles } from "../assets/styles/globalStyles";
import { dateToString } from "../utils/GlobalFuncitions";
import DateTimePicker from "@react-native-community/datetimepicker";

const TimeSlot = ({ index, set, time }) => {
    //     const [showDatePicker, setShowDatePicker] = useState(false);
    //     const [mode, setMode] = useState("date");

    //     const openDatePicker = () => {
    //         setShowDatePicker(true);
    //     };

    //     const onCancel = () => {
    //         // You should close the modal in here
    //         setShowDatePicker(false);
    //     };

    //     const onConfirm = (start, end) => {
    //         // You should close the modal in here

    //         setShowDatePicker(false);
    //         set(index, start, end);
    //     };

    //     ///////////////////////////////////////////
    // const onChange = (event, selectedDate) => {
    //   const currentDate = selectedDate || date;
    //   setShow(Platform.OS === 'ios');
    //   setDate(currentDate);
    //   date.getDate !== null? showTimepicker : null;
    // };
    //     //////////////////////////////////////////////////

    //     return (
    //         <View style={{ width: "80%", alignItems: "center" }}>
    //             <View
    //                 style={[
    //                     globalStyles.text_input,
    //                     {
    //                         flexDirection: "row",
    //                         justifyContent: "space-between",
    //                         width: "100%",
    //                     },
    //                 ]}
    //             >
    //                 <Text>
    //                     {time.start ? dateToString(time.start) : "start"} -{" "}
    //                     {time.end ? dateToString(time.end) : "finish"}
    //                 </Text>
    //                 <TouchableOpacity onPress={openDatePicker}>
    //                     <MaterialCommunityIcons
    //                         name="calendar"
    //                         color={colors.primary}
    //                         size={30}
    //                     />
    //                 </TouchableOpacity>
    //             </View>

    //             <DatePicker
    //                 onConfirm={onConfirm}
    //                 isVisible={showDatePicker}
    //                 mode={"range"}
    //                 onCancel={onCancel}
    //             />
    //         </View>
    //     );
    // };

    const [date, setDate] = useState(new Date());
    const [mode, setMode] = useState("date");
    const [show, setShow] = useState(false);

    const onChange = (event, selectedDate) => {
        setShow(Platform.OS === "ios");
        if (mode === "date") {
            const currentDate = selectedDate || date;
            setDate(currentDate);
            setMode("time");
            setShow(Platform.OS !== "ios");
        } else {
            const currentDate = selectedDate || date;
            setDate(currentDate);
        }
        console.log(date);

        // date.getDate !== null ? showTimepicker : null;
        console.log("selected date:" + selectedDate);
    };

    const showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);
    };

    const showDatepicker = () => {
        showMode("date");
    };

    const showTimepicker = () => {
        showMode("time");
    };

    return (
        <View>
            <View style={{ width: 200, alignItems: "center" }}>
                <View
                    style={[
                        globalStyles.text_input,
                        {
                            flexDirection: "row",
                            justifyContent: "space-between",
                            width: "100%",
                        },
                    ]}
                >
                    <Text>{dateToString(date)}
                        {/* {time.start ? dateToString(time.start) : "start"} -{" "}
                        {time.end ? dateToString(time.end) : "finish"} */}
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
                    value={date}
                    mode={mode}
                    is24Hour={true}
                    display="default"
                    onChange={onChange}
                />
            )}
        </View>
    );
};
export default TimeSlot;
