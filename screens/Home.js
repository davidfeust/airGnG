import React, {useContext} from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';
import {getAuth} from "firebase/auth";
import {AuthenticatedUserContext} from "../navigation/AuthenticatedUserProvider";

const auth = getAuth();


export default function Home() {
    const {user} = useContext(AuthenticatedUserContext);

    const handleSignOut = async () => {
        try {
            await auth.signOut();
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <View style={styles.container}>
            <Text>Home</Text>
            <Text>{user.email}</Text>
            <Button title={'login'} onPress={handleSignOut}/>
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
