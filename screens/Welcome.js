import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { globalStyles } from "../assets/styles/globalStyles";
import MyButton from "../components/MyButton";

/**
 * create a Welcome page where the user can sing in or sing up
 * @returns <form>
 */

export default function Welcome(props) {
    return (
        <View style={styles.container}>
            <Text style={[globalStyles.title, styles.title]}>
                Welcome to Air GnG!
            </Text>
            <MyButton
                onPress={() => props.navigation.push("SignUp")}
                text={"Sign Up"}
            />
            <MyButton
                onPress={() => props.navigation.push("SignIn")}
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
