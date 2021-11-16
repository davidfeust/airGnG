import React from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';
import {getAuth, signInWithEmailAndPassword} from "firebase/auth";

const auth = getAuth();

export default function Login() {

    const handleLogin = async () => {
        await signInWithEmailAndPassword(auth, 'test@test.com', '123456')
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
