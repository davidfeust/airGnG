import React, {useState} from 'react';
import {auth} from "../config/firebase";
import {Button, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import {createUserWithEmailAndPassword} from "firebase/auth";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import {globalStyles} from "../assets/styles/globalStyles";

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
            <Text style={[globalStyles.title, styles.title]}>Sing Up</Text>
            <TextInput style={[globalStyles.text_input, {marginTop: 20}]} onChangeText={text => setEmail(text)}
                       placeholder="Insert email"
                       autoCompleteType={"email"}
                       keyboardType={"email-address"}/>


            <View style={[globalStyles.text_input, {
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
            }]}>
                <View style={{flex: 10}}>
                    <TextInput onChangeText={text => setPassword(text)}
                               placeholder="Insert password" secureTextEntry={showPass}
                               autoCompleteType={"password"}/>
                </View>
                <View style={{flex: 1}}>
                    <TouchableOpacity onPress={() => setShowPass(!showPass)}>
                        <MaterialCommunityIcons name={showPass ? "eye-off" : "eye"} color={'gray'} size={18}/>
                    </TouchableOpacity>
                </View>
            </View>

            <TextInput style={globalStyles.text_input} onChangeText={text => setPasswordRepeat(text)}
                       placeholder="Repeat password"
                       secureTextEntry={showPass}>
            </TextInput>

            <TouchableOpacity style={[globalStyles.bt, {marginTop: 60}]} onPress={handlerSingUp}>
                <Text style={globalStyles.in_bt}>Sign Up</Text>
            </TouchableOpacity>


        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
    },
    title: {
        marginTop: '30%',
        marginBottom: '20%'
    }
});
