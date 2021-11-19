import React, {useState} from 'react';
import {auth} from "../config/firebase";
import {Button, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import {createUserWithEmailAndPassword} from "firebase/auth";
import {MaterialCommunityIcons} from "@expo/vector-icons";

/**
 * create a page where the user fills a form
 * on submitting, the user returns to the login screen,
 * and the data get uploaded to firebase after validation.
 * if the data is valid, a new user should be registered to the app.
 * ask for email, password, stationId, stationLocation ect.
 * @returns <form>
 */


export default function SignUp() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordRepeat, setPasswordRepeat] = useState("");
    const [showPass, setShowPass] = useState(true);

    function handlerSingUp() {
        console.log(email)
        console.log(password)
        console.log(passwordRepeat)
        if (password === passwordRepeat) {
            //    firebase
            createUserWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    // Signed in
                    const user = userCredential.user;
                    // ...
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    alert(errorMessage);
                });

        } else {
            alert("password dose not match the repeat password")
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                sing up</Text>
            <TextInput onChangeText={text => setEmail(text)} placeholder="insert email" autoCompleteType={"email"}
                       keyboardType={"email-address"}/>
            <TextInput onChangeText={text => setPassword(text)} placeholder="insert password" secureTextEntry={showPass}
                       autoCompleteType={"password"}/>
            <TextInput onChangeText={text => setPasswordRepeat(text)} placeholder="repeat password"
                       secureTextEntry={showPass}/>
            <TouchableOpacity onPress={() => setShowPass(!showPass)}>
                <MaterialCommunityIcons name={showPass ? "eye-off" : "eye"} color={'gray'} size={18}/>
            </TouchableOpacity>

            <Button onPress={handlerSingUp} title="sing up"/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 30,
    }
});