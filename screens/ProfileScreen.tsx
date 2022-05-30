import React, { useContext, useState } from 'react';
import { Image, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { color } from 'react-native-elements/dist/helpers';
import { Rating } from 'react-native-ratings';
import { AirGnGUser } from '../App.d';
import { globalStyles } from '../assets/styles/globalStyles';
import CustomButton from '../components/CustomButton';
import { auth } from '../config/firebase';
import { AuthenticatedUserContext } from '../providers/AuthenticatedUserProvider';
import { getAverageRate  } from '../utils/GlobalFuncitions';

export default function ProfileScreen({owner, navigation }:{owner:AirGnGUser, navigation:any}) {
    const [showBigImage, setShowBigImage] = useState(false);
    const { user} = useContext(AuthenticatedUserContext);
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
            <Pressable
                onPressIn={() => setShowBigImage(true)}
                onPressOut={() => setShowBigImage(false)}
            >
                <Image
                    style={{ height: 111, width: 111 }}
                    borderRadius={100}
                    source={
                        owner.uid? { uri: 'https://firebasestorage.googleapis.com/v0/b/airgng-dfc98.appspot.com/o/images_profiles%2F' + owner.uid + '.jpg?alt=media&token=717e7ae2-2377-44ba-bd88-55ba45ff3ddd'}
                            : require('../assets/defaults/default_image.png')
                    }
                />
                <Modal visible={showBigImage} transparent animationType='fade'>
                    <View style={styles.modalView}>
                        <Image
                            style={{ height: 300, width: 300 }}
                            source={
                                owner.uid
                                    ? { uri: 'https://firebasestorage.googleapis.com/v0/b/airgng-dfc98.appspot.com/o/images_profiles%2F' + owner.uid + '.jpg?alt=media&token=717e7ae2-2377-44ba-bd88-55ba45ff3ddd'}
                                    : require('../assets/defaults/default_image.png')
                            }
                            borderRadius={100}
                        />
                    </View>
                </Modal>
            </Pressable>
                <Text style={globalStyles.subTitle}>{owner.name} profile </Text>
            
            <Rating readonly startingValue={owner.reviews? getAverageRate(owner.reviews) : 0 } />
            <Text style={{color:'gold'} }>( {owner?.reviews.length} )</Text>
            <CustomButton text={'Logout'} onPress={handleSignOut} />
            
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


