import React, { useContext, useEffect, useState } from 'react';
import { Image, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { Rating } from 'react-native-ratings';
import { globalStyles } from '../../assets/styles/globalStyles';
import CustomButton from '../../components/CustomButton';
import { auth } from '../../config/firebase';
import { AuthenticatedUserContext } from '../../providers/AuthenticatedUserProvider';
import { getAverageRate } from '../../utils/GlobalFuncitions';

export default function HomeTab({ navigation }) {
    const [showBigImage, setShowBigImage] = useState(false);
    const { user } = useContext(AuthenticatedUserContext);
    const [isThereImage, setIsThereImage] = useState(false);
    const imageUrl =
        'https://firebasestorage.googleapis.com/v0/b/airgng-dfc98.appspot.com/o/images_profiles%2F' +
        user.uid +
        '.jpg?alt=media&token=af588fef-1e73-4f03-8b09-b5642d9253df';
    // user.reviews = [{rating:0, reviewer: 'shimon', comment: 'he is awsome'}]

    const handleSignOut = async () => {
        try {
            await auth.signOut();
        } catch (error) {
            console.log(error);
        }
    };
  
    useEffect(() => {
        fetch(imageUrl)
            .then((response) => {
                if (response.status === 200) {
                    setIsThereImage(true);
                } else {
                    setIsThereImage(false);
                }
            })
            .catch((err) => {
                console.log('ERR: ' + err);
            });
    }, [isThereImage]);
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
                        isThereImage
                            ? { uri: imageUrl }
                            : require('../../assets/defaults/default_image.png')
                    }
                />
                <Modal visible={showBigImage} transparent animationType='slide'>
                    <View style={styles.modalView}>
                        <Image
                            style={{ height: 300, width: 300 }}
                            source={
                                isThereImage
                                    ? { uri: imageUrl }
                                    : require('../../assets/defaults/default_image.png')
                            }
                            borderRadius={10}
                        />
                    </View>
                </Modal>
            </Pressable>
            <Rating
                readonly
                startingValue={user.reviews ? getAverageRate(user.reviews) : 0}
            />
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
    },
});
