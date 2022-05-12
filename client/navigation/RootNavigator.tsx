import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { AirGnGUser } from '../App.d';
import { auth, db } from '../config/firebase';
import { AuthenticatedUserContext } from '../providers/AuthenticatedUserProvider';
import AuthStack from './AuthStack';
import LoggedInStack from './LoggedInStack';

export default function RootNavigator() {
    const { user, setUser } = useContext(AuthenticatedUserContext);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // onAuthStateChanged returns an unsubscriber
        // unsubscribe auth listener on unmount
        return onAuthStateChanged(auth, async (authenticatedUser) => {
            if (authenticatedUser) {
                // get user info from DB and set it to user provider
                const docRef = doc(db, 'users', authenticatedUser.uid);
                const docSnap = await getDoc(docRef);
                const airGnGUser = docSnap.data() as AirGnGUser;

                if (docSnap.exists()) {
                    setUser(Object.assign(airGnGUser, authenticatedUser));
                } else {
                    setUser({
                        name: '',
                        reviews: [],
                        orders: [],
                        ...authenticatedUser,
                    });
                }
            } else {
                setUser(null);
            }
            setIsLoading(false);
        });
    }, []);

    if (isLoading) {
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <ActivityIndicator size='large' />
            </View>
        );
    }
    return user ? <LoggedInStack /> : <AuthStack />;
}
