import React, {useState} from 'react';
import {Button, StyleSheet, Text, TextInput, View} from 'react-native';
import {getAuth, signInWithEmailAndPassword} from "firebase/auth";

const auth = getAuth();

export default function Login() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        await signInWithEmailAndPassword(auth, email, password)
            .then(userCredentials => {
                const user = userCredentials.user;
            })
            .catch(error => {
                alert(error.message);
            });
    }

    return (
        <View style={styles.container}>
            <Text>Login</Text>
            <TextInput placeholder={'email'} onChangeText={(text) => setEmail(text)}/>
            <TextInput placeholder={'password'} onChangeText={(text) => setPassword(text)} secureTextEntry/>
            <Button title={'login'} onPress={handleLogin}/>
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
});
