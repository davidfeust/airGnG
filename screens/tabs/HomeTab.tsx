import React, { useContext, useEffect, useState } from 'react';
import { Text, Image, View, Modal, StyleSheet, Pressable } from 'react-native';
import { globalStyles } from '../../assets/styles/globalStyles';
import CustomButton from '../../components/CustomButton';
import { AuthenticatedUserContext } from '../../providers/AuthenticatedUserProvider';
import { auth, db } from '../../config/firebase';
import { doc } from 'firebase/firestore';
import { Rating } from 'react-native-ratings';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default function HomeTab({ navigation }) {
    const [showBigImage, setShowBigImage] = useState(false);
    const { user, unSubUser } = useContext(AuthenticatedUserContext);
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
            <Pressable
                onPressIn={() => setShowBigImage(true)}
                onPressOut={() => setShowBigImage(false)}
            >
                <Image
                    style={{ height: 200, width: 200 }}
                    borderRadius={100}
                    source={
                        user.image
                            ? { uri: user.image }
                            : require('../../assets/defaults/default_image.png')
                    }
                />
                <Modal visible={showBigImage} transparent animationType='slide'>
                    <View style={styles.modalView}>
                        <Image
                            style={{ height: 300, width: 300 }}
                            source={
                                user.image
                                    ? { uri: user.image }
                                    : require('../../assets/defaults/default_image.png')
                            }
                            borderRadius={10}
                        />
                    </View>
                </Modal>
            </Pressable>
            <Rating readonly startingValue={user.rating} />
            <Text>( {user?.reviews.length} )</Text>
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

const styles = StyleSheet.create({
    modalView: {
        margin: '50%',
        backgroundColor: 'white',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        // position: 'absolute',
        // bottom: 20,
    },
});
