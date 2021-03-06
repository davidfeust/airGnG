import React, { useContext, useEffect, useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import {
    collection,
    deleteDoc,
    doc,
    getDocs,
    query,
    where,
} from 'firebase/firestore';
import { db } from '../../config/firebase';
import MyStationCard from '../../components/MyStationCard';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../assets/styles/colors';
import { publicStationsContext } from '../../providers/PublicStationsProvider';
import { AuthenticatedUserContext } from '../../providers/AuthenticatedUserProvider';
import { deleteObject, getStorage, ref } from '@firebase/storage';
import { globalStyles } from '../../assets/styles/globalStyles';
import CustomButton from '../../components/CustomButton';

/**
 * represents the page where a user can see the status of his post.
 * for now, its not posible that more than 1 user will subscribe per post,
 * but it might change...
 * @returns <ScrollView>
 */
export default function MyStationsTab({ navigation }) {
    const { user } = useContext(AuthenticatedUserContext);
    const { stations } = useContext(publicStationsContext);
    const [myStations, setMyStations] = useState([]);

    useEffect(() => {
        //give the admin user all the stations
        if (user.admin) {
            setMyStations(stations);
        } else {
            setMyStations(
                stations.filter(({ owner_id }) => owner_id === user.uid)
            );
        }
    }, [stations]);

    const onEdit = (id) => {
        navigation.push('EditMyStationScreen', { station_id: id }); // push to the navigation EditMyStationScreen() component' so we could go back
    };

    const onDelete = (id) => {
        const q = query(
            collection(db, 'orders'),
            where('station_id', '==', id)
        );
        getDocs(q).then((snap) => {
            if (snap.docs.length > 0) {
                return Alert.alert(
                    'someone invited your station!',
                    'you should wait until the reservation will over...'
                );
            }

            return Alert.alert(
                'Are your sure?',
                'By pressing yes you confirm to remove this station permanently',
                [
                    // The "Yes" button
                    {
                        text: 'Yes',
                        onPress: async () => {
                            await deleteDoc(doc(db, 'stations', id));

                            const storgae = getStorage();
                            deleteObject(ref(storgae, id + '.jpg')).catch(
                                () => {}
                            );
                        },
                    },
                    // The "No" button
                    // Does nothing but dismiss the dialog when tapped
                    {
                        text: 'No',
                    },
                ]
            );
        });
    };

    if (myStations.length !== 0) {
        return (
            <View style={{ flex: 1 }}>
                <TouchableOpacity
                    style={styles.plus}
                    onPress={() => navigation.push('AddNewStationScreen')}
                >
                    <MaterialCommunityIcons
                        style={{ textAlign: 'center' }}
                        name={'plus'}
                        color={'white'}
                        size={26}
                    />
                </TouchableOpacity>

                <ScrollView>
                    {myStations.map((station) => (
                        <MyStationCard
                            station={station}
                            onDelete={onDelete}
                            onEdit={onEdit}
                            key={station.id}
                            onGoToPublish={() =>
                                navigation.push('PublishStationScreen', {
                                    station_id: station.id,
                                })
                            }
                            onGoToReservation={() =>
                                navigation.push('ReservationFromMeScreen', {
                                    station_id: station.id,
                                    station_image: station.image,
                                    station_address: station.address,
                                })
                            }
                        />
                    ))}
                </ScrollView>
            </View>
        );
    } else {
        return (
            <View
                style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    flex: 1,
                }}
            >
                <Text style={globalStyles.subTitle}>No Stations yet...</Text>
                <CustomButton
                    text={'Add Station'}
                    onPress={() => navigation.navigate('AddNewStationScreen')}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    plus: {
        backgroundColor: colors.primary,
        alignContent: 'center',
        justifyContent: 'center',
        width: 60,
        height: 60,
        borderRadius: 15,
        position: 'absolute',
        bottom: 20,
        right: 20,
        zIndex: 2,
        elevation: 5,
    },
});
