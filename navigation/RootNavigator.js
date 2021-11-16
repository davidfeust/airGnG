import React, {useContext, useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {ActivityIndicator, Text, View} from 'react-native';
import {AuthenticatedUserContext} from './AuthenticatedUserProvider';
import {getAuth, onAuthStateChanged} from 'firebase/auth';
import {app} from "../config/firebase";
import LoggedInStack from "./LoggedInStack";
import AuthStack from "./AuthStack";

const auth = getAuth();

export default function RootNavigator() {
    const {user, setUser} = useContext(AuthenticatedUserContext);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // onAuthStateChanged returns an unsubscriber
        const unsubscribeAuthStateChanged = onAuthStateChanged(
            auth,
            authenticatedUser => {
                authenticatedUser ? setUser(authenticatedUser) : setUser(null);
                setIsLoading(false);
            }
        );

        // unsubscribe auth listener on unmount
        return unsubscribeAuthStateChanged;
    }, []);

    if (isLoading) {
        return (
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <ActivityIndicator size='large'/>
            </View>
        );
    }
    return (
        <NavigationContainer>
            {user ? <LoggedInStack/> : <AuthStack/>}
        </NavigationContainer>
    );
}
