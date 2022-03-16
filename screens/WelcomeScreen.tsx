import React from "react";
import {StyleSheet, Text, View} from "react-native";
import {globalStyles} from "../assets/styles/globalStyles";
import CustomButton from "../components/CustomButton";

/**
 * create a WelcomeScreen page where the user can sing in or sing up
 * @returns <form>
 */

export default function WelcomeScreen(props) {
    return (
        <View style={styles.container}>
            <Text style={[globalStyles.title, styles.title]}>
                Welcome to Air GnG!
            </Text>
            <CustomButton
                onPress={() => props.navigation.push("SignUpScreen")}
                text={"Sign Up"}
            />
            <CustomButton
                onPress={() => props.navigation.push("SignInScreen")}
                text={"Sign In"}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
    },
    title: {
        marginTop: "35%",
        marginBottom: "35%",
    },
});
