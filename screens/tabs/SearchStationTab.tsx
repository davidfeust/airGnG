import React, { useContext, useEffect, useRef, useState } from 'react';
import { Dimensions, FlatList, Platform, StyleSheet, View } from 'react-native';
import { publicStationsContext } from '../../providers/PublicStationsProvider';
import MapView, { Marker } from 'react-native-maps';
import { Image } from 'react-native-elements';
import { colors } from '../../assets/styles/colors';
import AddressAutocomplete from '../../components/AddressAutocomplete';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AuthenticatedUserContext } from '../../providers/AuthenticatedUserProvider';
import SlidingUpPanel from 'rn-sliding-up-panel';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import MiniCard from '../../components/MiniCard';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { GooglePlacesAutocompleteRef } from 'react-native-google-places-autocomplete';
import { Station } from '../../App.d';

/**
 * create a page with all available stations in the DB,
 * and a button for each to represent subscribing to station.
 * and a listener to that button so the station gets orderd.
 * as soon as the user subscribed for a station,
 * it should be marked as unavailable and removed from this screen
 * @returns <ScrollView>
 */

export default function SearchStationTab({ navigation }) {
    //for the autocomplete function
    const [cords, setCords] = useState(null);
    const [viewPort, setViewPort] = useState(null);
    const [ownerDetails, setOwnerDetails] = useState([]);
    const { stations } = useContext(publicStationsContext);
    const [selectedId, setSelectedId] = useState(null);
    const [publishedStations, setPublishedStations] = useState(stations);
    const { user } = useContext(AuthenticatedUserContext);
    const cardWidth = 360;
    const cardMarginHorizontal = 7;

    const slideUpPanel = useRef<SlidingUpPanel>();
    const googleAddress = useRef<GooglePlacesAutocompleteRef>();
    const map = useRef<MapView>();
    const flatList = useRef<FlatList>();

    const viewConfig = useRef({
        itemVisiblePercentThreshold: 70,
        waitForInteraction: true,
        minimumViewTime: 60,
    });
    const onViewChanged = useRef(({ viewableItems }) => {
        if (viewableItems.length > 0) {
            const selectedPlace = viewableItems[0].item;
            setSelectedId(selectedPlace.id);
        }
    });

    const animateToMarker = () => {
        if (selectedId) {
            const index = publishedStations.findIndex(
                (card) => card.id === selectedId
            );
            const selectedPlace = publishedStations[index];
            const region = {
                latitude: selectedPlace.cords.lat - 0.005,
                longitude: selectedPlace.cords.lng,
                latitudeDelta: 0.02,
                longitudeDelta: 0.02,
            };
            map.current.animateToRegion(region);
        }
    };

    const onSelectingCard = (station: Station) => {
        navigation.navigate('OrderStack', station);
    };

    useEffect(() => {
        // updating owner details
        const owners = [];
        publishedStations.forEach(async (station) => {
            const ownerDoc = await getDoc(doc(db, `users/${station.owner_id}`));
            owners.push(ownerDoc.data());
        });
        setOwnerDetails(owners);
    }, [publishedStations]);

    const scrollToCard = (index: number) => {
        flatList.current.scrollToIndex({ index, animated: true });
    };

    //In this useEffect we jump the correct location on the map when the user select address in the search bar
    //deps : cords - the object that hold the coordinates that the user choose
    useEffect(() => {
        if (cords != null) {
            const region = {
                latitude: cords.lat,
                longitude: cords.lng,
                latitudeDelta: 0.02,
                longitudeDelta: 0.02,
            };
            // here we adjust the depth of view, using the difference in north-east and south-west
            // ex - if you will look for israel in the previous you will get just one dot(maybe in the center)
            // but in the new version you will get according to difference in north-east and south-west
            if (viewPort != null) {
                const { northeast, southwest } = viewPort;
                region.latitudeDelta = (northeast.lat - southwest.lat) * 0.5;
                region.longitudeDelta = (northeast.lng - southwest.lng) * 0.5;
            }
            map.current.animateToRegion(region);
        }
    }, [cords]);

    useEffect(() => {
        //updating published stations based on stations changes
        setPublishedStations(
            stations.filter((s) => s.published && s.owner_id !== user.uid)
        );
    }, [stations]);

    slideUpPanel.current?.show();

    return (
        <View style={styles.container}>
            {/*/here we warped the AddressAutocomplete component in another view in order to give it a special style */}
            <View style={styles.searchBox}>
                <AddressAutocomplete
                    reference={googleAddress}
                    setCords={setCords}
                    placeHolder={'Search Here...'}
                    styleTag={'styleSearch'}
                    setViewPort={setViewPort}
                />
                <MaterialCommunityIcons
                    name={'magnify'}
                    size={22}
                    style={{ alignSelf: 'center', marginRight: 20 }}
                />
            </View>
            <MapView
                ref={map}
                initialRegion={{
                    latitude: 31.046051,
                    longitude: 34.851612,
                    latitudeDelta: 4,
                    longitudeDelta: 4,
                }}
                style={styles.map}
            >
                {publishedStations.map((card, index) => (
                    <Marker
                        key={card.id}
                        title={card.address}
                        coordinate={{
                            latitude: card.cords.lat,
                            longitude: card.cords.lng,
                        }}
                        tappable
                        onPress={(e) => {
                            e.stopPropagation();
                            setSelectedId(card.id);
                            const region = {
                                latitude: card.cords.lat,
                                longitude: card.cords.lng,
                                latitudeDelta: 0.02,
                                longitudeDelta: 0.02,
                            };
                            map.current.animateToRegion(region);

                            scrollToCard(index);
                        }}
                    >
                        <Image
                            source={require('../../assets/markers/basic_marker.png')}
                            style={
                                card.id === selectedId
                                    ? styles.selectedMarker
                                    : styles.regularMarker
                            }
                            resizeMode='contain'
                        />
                    </Marker>
                ))}
            </MapView>

            <SlidingUpPanel
                draggableRange={{ top: 230, bottom: 130 }}
                ref={(c) => (slideUpPanel.current = c)}
                backdropOpacity={0.3}
                snappingPoints={[130, 230]}
            >
                <FlatList
                    style={{ position: 'absolute' }}
                    keyExtractor={(item) => item.id}
                    ref={flatList}
                    data={publishedStations}
                    renderItem={({
                        item: {
                            address,
                            price,
                            image,
                            time_slots,
                            id,
                            phone,
                            owner_id,
                        },
                        index,
                    }) => (
                        <TouchableWithoutFeedback
                            onPress={() =>
                                onSelectingCard({
                                    address,
                                    time_slots,
                                    price,
                                    image,
                                    id,
                                    phone,
                                    owner_id,
                                })
                            }
                        >
                            <View>
                                <MiniCard
                                    image={image}
                                    ownerDetails={ownerDetails[index]}
                                    address={address}
                                    price={price}
                                    style={{
                                        width: cardWidth,
                                        overflow: 'hidden',
                                        marginHorizontal: cardMarginHorizontal,
                                    }}
                                />
                            </View>
                        </TouchableWithoutFeedback>
                    )}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    snapToInterval={cardWidth + 2 * cardMarginHorizontal}
                    contentContainerStyle={{
                        paddingHorizontal:
                            Platform.OS === 'android'
                                ? cardMarginHorizontal / 2
                                : 0,
                    }}
                    decelerationRate={'fast'}
                    viewabilityConfig={viewConfig.current}
                    onViewableItemsChanged={onViewChanged.current}
                    onMomentumScrollEnd={animateToMarker}
                    getItemLayout={(data, index) => ({
                        length: cardWidth + cardMarginHorizontal * 2,
                        offset: (cardWidth + cardMarginHorizontal * 2) * index,
                        index,
                    })}
                />
            </SlidingUpPanel>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        // justifyContent: "center",
    },
    map: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
    selectedMarker: {
        width: 26,
        height: 28,
        tintColor: colors.primary,
    },
    regularMarker: {
        width: 26,
        height: 28,
        tintColor: colors.secondary,
    },
    //we use the searchBox style in order to present nicely the search bar oon the map
    searchBox: {
        position: 'absolute',
        marginTop: Platform.OS === 'ios' ? 20 : 40,
        flexDirection: 'row',
        backgroundColor: '#fff',
        width: '90%',
        alignSelf: 'center',
        borderRadius: 15,
        padding: 0,
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
        elevation: 10,
        zIndex: 3,
    },
});
