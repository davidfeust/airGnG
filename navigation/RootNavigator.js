import React, {useContext, useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {ActivityIndicator, View} from 'react-native';
import {AuthenticatedUserContext} from './AuthenticatedUserProvider';
import {onAuthStateChanged} from 'firebase/auth';
import {auth, db} from "../config/firebase";
import LoggedInStack from "./LoggedInStack";
import AuthStack from "./AuthStack";
import {doc, getDoc} from "firebase/firestore";


export default function RootNavigator() {
    const {user, setUser} = useContext(AuthenticatedUserContext);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // onAuthStateChanged returns an unsubscriber
        // unsubscribe auth listener on unmount
        return onAuthStateChanged(auth, async authenticatedUser => {
                if (authenticatedUser) {
                    // get user info from DB and set it to user provider
                    const docRef = doc(db, 'users', authenticatedUser.uid);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        setUser({...authenticatedUser, ...docSnap.data()});
                    } else {
                        setUser(authenticatedUser);
                    }
                } else {
                    setUser(null);
                }
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
