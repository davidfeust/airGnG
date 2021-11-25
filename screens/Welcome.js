import React from "react";
import {Button, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {globalStyles} from "../assets/styles/globalStyles";

/**
 * create a Welcome page where the user can sing in or sing up
 * @returns <form>
 */

export default function Welcome(props) {
    return (
        <View style={styles.container}>
            <Text style={[globalStyles.title, styles.title]}>Welcome to Air GnG!</Text>

            <TouchableOpacity style={globalStyles.bt}
                              onPress={() => props.navigation.push("SignUp")}>
                <Text style={globalStyles.in_bt}>Sign Up</Text>
            </TouchableOpacity>
            <TouchableOpacity style={globalStyles.bt}
                              onPress={() => props.navigation.push("SignIn")}>
                <Text style={globalStyles.in_bt}>Sign In</Text>
            </TouchableOpacity>
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
        marginTop: '35%',
        marginBottom: '35%',
    },

});
