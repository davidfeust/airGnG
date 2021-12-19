import React, {useContext, useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {ActivityIndicator, View} from 'react-native';
import {AuthenticatedUserContext} from './AuthenticatedUserProvider';
import {onAuthStateChanged} from 'firebase/auth';
import {auth} from "../config/firebase";
import LoggedInStack from "./LoggedInStack";
import AuthStack from "./AuthStack";


export default function RootNavigator() {
    const {user, setUser} = useContext(AuthenticatedUserContext);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // onAuthStateChanged returns an unsubscriber
        // unsubscribe auth listener on unmount
        return onAuthStateChanged(auth, authenticatedUser => {
                authenticatedUser ? setUser(authenticatedUser) : setUser(null);
                setIsLoading(false);
            }
        );
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
