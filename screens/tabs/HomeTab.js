import React, { useContext, useEffect, useState } from 'react';
import { Text, Image, View } from 'react-native';
import { globalStyles } from '../../assets/styles/globalStyles';
import CustomButton from '../../components/CustomButton';
import { AuthenticatedUserContext } from '../../providers/AuthenticatedUserProvider';
import { auth, db } from '../../config/firebase';
import { doc } from 'firebase/firestore';
import { Rating } from 'react-native-ratings';

export default function HomeTab({ navigation }) {
    const { user } = useContext(AuthenticatedUserContext);
    // user.reviews = [{rating:0, reviewer: 'shimon', comment: 'he is awsome'}]

    const handleSignOut = async () => {
        try {
            await auth.signOut();
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <View style={[globalStyles.container, { justifyContent: 'center' }]}>
            {user.name ? (
                <Text style={globalStyles.subTitle}>Hello {user.name}!</Text>
            ) : (
                <Text style={globalStyles.subTitle}>Hello to you!</Text>
            )}
            <Rating readonly startingValue={user.rating} />
            <CustomButton text={'Logout'} onPress={handleSignOut} />
            <CustomButton
                text={'Edit your profile'}
                onPress={() => navigation.push('UserDetailsScreen')}
            />
            {user.admin && (
                <Text style={{ color: 'red', fontSize: 24 }}>
                    You have an admin privilege
                </Text>
            )}
        </View>
    );
}
