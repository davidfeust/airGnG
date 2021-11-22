import React from "react";
import { Button, StyleSheet, Text, View } from "react-native";

/**
 * create a Welcome page where the user can sing in or sing up
 * @returns <form>
 */

export default function Welcome(props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Air-GnG</Text>

      <Button onPress={() => props.navigation.push("SignUp")} title="sing up" />
      <Button onPress={() => props.navigation.push("SignIn")} title="sing in" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 30,
  },
});
