import React, { useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { globalStyles } from "../assets/styles/globalStyles";
import { Text, TouchableOpacity } from "react-native";
import { colors } from "../assets/styles/colors";

/**
 *
 * @param onPress - the given onPress fun
 * @param text - to show inside the button
 * @param processing - optional boolean, you will need to change it in the given onPress, true if you still in the fun else false
 * @param style - you can add your own style such as marginTop ect.
 * @returns {JSX.Element} - the button
 * @constructor
 */
export default function MyButton({ onPress, text, processing = false, style }) {
  return (
    <TouchableOpacity
      style={[globalStyles.bt, style]}
      onPress={onPress}
      disabled={processing}
    >
      {processing ? (
        <ActivityIndicator color={"#fff"} />
      ) : (
        <Text style={globalStyles.in_bt}>{text}</Text>
      )}
    </TouchableOpacity>
  );
}
