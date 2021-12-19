import React from "react";
import {ActivityIndicator, Text, TouchableOpacity} from "react-native";
import {globalStyles} from "../assets/styles/globalStyles";
import {colors} from "../assets/styles/colors";

/**
 *
 * @param onPress - the given onPress fun
 * @param text - to show inside the button
 * @param processing - optional boolean, you will need to change it in the given onPress, true if you still in the fun else false
 * @param style - you can add your own style such as marginTop ect.
 * @param disabled - optional boolean, allow to pass state of validation form, to disable the button until the form valid
 * @returns {JSX.Element} - the button
 * @constructor
 */
export default function CustomButton({onPress, text, processing = false, style, disabled = false}) {
    return (
        <TouchableOpacity
            style={[globalStyles.bt, style, {backgroundColor: disabled ? colors.invalid : colors.primary}]}
            onPress={onPress}
            disabled={processing || disabled}
        >
            {processing ? (
                <ActivityIndicator color={"#fff"}/>
            ) : (
                <Text style={globalStyles.in_bt}>{text}</Text>
            )}
        </TouchableOpacity>
    );
}
