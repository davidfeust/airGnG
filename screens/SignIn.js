import React, {useState} from "react";
import {StyleSheet, Text, TextInput, TouchableOpacity, View,} from "react-native";
import {signInWithEmailAndPassword} from "firebase/auth";
import {auth} from "../config/firebase";
import {globalStyles} from "../assets/styles/globalStyles";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import MyButton from "../components/MyButton";

export default function SignIn() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPass, setShowPass] = useState(true);
    const [processing, setProcessing] = useState(false);


    const handleLogin = async () => {
        setProcessing(true);
        await signInWithEmailAndPassword(auth, email, password)
            //after 'then' function we will change the processing value in order to show the indicator
            .then((userCredentials) => {
                const user = userCredentials.user;
                setProcessing(false);
            })
            .catch((error) => {
                alert(error.message);
                setProcessing(false);
            });
    };

    return (
        <View style={styles.container}>
            <Text style={[globalStyles.title, styles.title]}>Sing In</Text>
            <TextInput
                style={globalStyles.text_input}
                placeholder={"Email"}
                onChangeText={(text) => setEmail(text)}
            />

            <View
                style={[
                    globalStyles.text_input,
                    {
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                    },
                ]}
            >
                <View style={{flex: 10}}>
                    <TextInput
                        onChangeText={(text) => setPassword(text)}
                        placeholder="Password"
                        secureTextEntry={showPass}
                        autoCompleteType={"password"}
                    />
                </View>
                <View style={{flex: 1}}>
                    <TouchableOpacity onPress={() => setShowPass(!showPass)}>
                        <MaterialCommunityIcons
                            name={showPass ? "eye-off" : "eye"}
                            color={"gray"}
                            size={18}
                        />
                    </TouchableOpacity>
                </View>
            </View>

            <MyButton onPress={handleLogin} text={'Login'} style={{marginTop: 60}} processing={processing}/>

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
        marginTop: "30%",
        marginBottom: "20%",
    },
});
