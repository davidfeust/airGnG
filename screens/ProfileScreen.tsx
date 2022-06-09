import { getDoc, doc } from 'firebase/firestore';
import React, { useContext, useEffect, useRef, useState } from 'react';
import {
    Image,
    Modal,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TouchableWithoutFeedback,
    View,
    FlatList,
    Touchable,
} from 'react-native';
import { BackgroundImage } from 'react-native-elements/dist/config';
import { color } from 'react-native-elements/dist/helpers';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { GooglePlacesAutocompleteRef } from 'react-native-google-places-autocomplete';
import MapView from 'react-native-maps';
import { Rating } from 'react-native-ratings';
import { SafeAreaView } from 'react-native-safe-area-context';
import SlidingUpPanel from 'rn-sliding-up-panel';
import { AirGnGUser, Station } from '../App.d';
import { globalStyles } from '../assets/styles/globalStyles';
import CustomButton from '../components/CustomButton';
import MiniCard from '../components/MiniCard';
import SlidingStations from '../components/SlidingStations';
import { auth, db } from '../config/firebase';
import { AuthenticatedUserContext } from '../providers/AuthenticatedUserProvider';
import { publicStationsContext } from '../providers/PublicStationsProvider';
import { getAverageRate } from '../utils/GlobalFuncitions';

export default function ProfileScreen({
    owner,
    navigation,
}: {
    owner: AirGnGUser;
    navigation: any;
}) {
    const [showBigImage, setShowBigImage] = useState(false);
    // user.reviews = [{rating:0, reviewer: 'shimon', comment: 'he is awsome'}]

    //////////////////////////////////// slides ////////////////////////////////////////////
    //for the autocomplete function
    const [cords, setCords] = useState(null);
    const [viewPort, setViewPort] = useState(null);
    const [ownerDetails, setOwnerDetails] = useState([]);
    const { stations } = useContext(publicStationsContext);
    const [selectedId, setSelectedId] = useState(null);
    const [publishedStations, setPublishedStations] =
        useState<Station[]>(stations);
    const { user } = useContext(AuthenticatedUserContext);
    const cardWidth = 350;
    const cardMarginHorizontal = 15;
    const flatList = useRef<FlatList<Station>>();
    const viewConfig = useRef({
        itemVisiblePercentThreshold: 70,
        waitForInteraction: true,
        minimumViewTime: 60,
    });
    const onViewChanged = useRef(({ viewableItems }) => {});

    const animateToMarker = () => {
        // if (selectedId) {
        //     const index = publishedStations.findIndex(
        //         (card) => card.id === selectedId
        //     );
        //     const selectedPlace = publishedStations[index];
        //     const region = {
        //         latitude: selectedPlace.cords.lat - 0.005,
        //         longitude: selectedPlace.cords.lng,
        //         latitudeDelta: 0.02,
        //         longitudeDelta: 0.02,
        //     };
        //     // map.current.animateToRegion(region);
        // }
    };

    const onSelectingCard = (station: Station) => {
        console.log('station pressed, navigition = '+ navigation);
        navigation?.navigate('OrderStack', station);
    };

    useEffect(() => {
        // updating owner details
        const owners = publishedStations.map(async (station) => {
            const ownerDoc = await getDoc(doc(db, `users/${station.owner_id}`));
            return ownerDoc.data();
        });
        Promise.all(owners).then(setOwnerDetails);
    }, [publishedStations]);

    const scrollToCard = (index: number) => {
        flatList.current.scrollToIndex({ index, animated: true });
    };
    /////////////////////////////////////////////////////////////////////////
    const handleSignOut = async () => {
        try {
            await auth.signOut();
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        //updating published stations based on stations changes
        setPublishedStations(
            stations.filter((s) => s.published && s.owner_id == user.uid)
        );
    }, [stations]);

    return (
        // main View
        <View
            style={[globalStyles.container, { justifyContent: 'flex-start' }]}
        >
            {/* top View- image, name, rate */}

            <SafeAreaView
                style={[
                    globalStyles.container,
                    { flexDirection: 'row', alignItems: 'flex-start' },
                ]}
            >
                <Pressable
                    style={{ margin: '4%' }}
                    onPressIn={() => setShowBigImage(true)}
                    onPressOut={() => setShowBigImage(false)}
                >
                    <Image
                        style={{ height: 111, width: 111 }}
                        borderRadius={111}
                        source={
                            owner.uid
                                ? {
                                      uri:
                                          'https://firebasestorage.googleapis.com/v0/b/airgng-dfc98.appspot.com/o/images_profiles%2F' +
                                          owner.uid +
                                          '.jpg?alt=media&token=717e7ae2-2377-44ba-bd88-55ba45ff3ddd',
                                  }
                                : require('../assets/defaults/default_image.png')
                        }
                    />
                    <Modal
                        visible={showBigImage}
                        transparent
                        animationType='fade'
                    >
                        <View style={styles.modalView}>
                            <Image
                                style={{ height: 300, width: 300 }}
                                source={
                                    owner.uid
                                        ? {
                                              uri:
                                                  'https://firebasestorage.googleapis.com/v0/b/airgng-dfc98.appspot.com/o/images_profiles%2F' +
                                                  owner.uid +
                                                  '.jpg?alt=media&token=717e7ae2-2377-44ba-bd88-55ba45ff3ddd',
                                          }
                                        : require('../assets/defaults/default_image.png')
                                }
                                borderRadius={100}
                            />
                        </View>
                    </Modal>
                </Pressable>
                <View style={[globalStyles.container, {}]}>
                    <Text style={globalStyles.subTitle}>
                        {' '}
                        {owner.name}'s profile!{' '}
                    </Text>
                    <Rating
                        readonly
                        startingValue={
                            owner.reviews ? getAverageRate(owner.reviews) : 0
                        }
                    />
                    <Text style={{ color: 'green' }}>
                        ( {owner?.reviews.length} )
                    </Text>
                </View>
            </SafeAreaView>
            {/* stations View  */}
            
                    <SlidingStations
                        flatList={flatList}
                        publishedStations={publishedStations}
                        onSelectingCard={onSelectingCard}
                        ownerDetails={ownerDetails}
                        cardWidth={cardWidth}
                        cardMarginHorizontal={cardMarginHorizontal}
                        viewConfig={viewConfig}
                        onViewChanged={onViewChanged}
                        animateToMarker={animateToMarker}
                        down={false}
                    />
            
        </View> // main View
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
