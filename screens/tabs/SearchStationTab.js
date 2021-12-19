import React, {useContext, useEffect, useRef, useState} from "react";
import {Animated, Dimensions, FlatList, Platform, StyleSheet, TouchableOpacity, View,} from "react-native";
import {publicStationsContext} from "../../providers/PublicStationsProvider";
import MapView, {Marker} from "react-native-maps";
import {globalStyles} from "../../assets/styles/globalStyles";
import {Image} from "react-native-elements";
import {colors} from "../../assets/styles/colors";
import MiniCard from "../../components/MiniCard";
import MaxiCard from "../../components/MaxiCard";
import AddressAutocomplete from "../../components/AddressAutocomplete";
import {MaterialCommunityIcons} from "@expo/vector-icons";

/**
 * create a page with all available stations in the DB,
 * and a button for each to represent subscribing to station.
 * and a listener to that button so the station gets orderd.
 * as soon as the user subscribed for a station,
 * it should be marked as unavailable and removed from this screen
 * @returns <ScrollView>
 */

export default function SearchStationTab({navigation}) {
    //for the autocomplete function
    const googleAddress = useRef();
    const [cords, setCords] = useState(null);
    const [viewPort, setViewPort] = useState(null);

    const stretchAnim = useRef(new Animated.Value(100)).current; // Initial
    const [showMaxiCard, setShowMaxiCard] = useState(false);
    const {stations} = useContext(publicStationsContext);
    const [selectedId, setSelectedId] = useState(null);

    useEffect(() => {
        if (!selectedId || !flatList) {
            return;
        }
        const index = stations.findIndex(
            (card) => card.id === selectedId
        );

        flatList.current.scrollToIndex({index, animated: true});

        const selectedPlace = stations[index];
        const region = {
            latitude: selectedPlace.cords.lat,
            longitude: selectedPlace.cords.lng,
            latitudeDelta: 0.02,
            longitudeDelta: 0.02,
        };
        map.current.animateToRegion(region);
    }, [selectedId]);

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
                const {northeast, southwest} = viewPort;
                region.latitudeDelta = (northeast.lat - southwest.lat) * 0.5;
                region.longitudeDelta = (northeast.lng - southwest.lng) * 0.5;
            }
            map.current.animateToRegion(region);
        }
    }, [cords]);

    const map = useRef();
    const flatList = useRef();

    const viewConfig = useRef({
        itemVisiblePercentThreshold: 70,
        waitForInteraction: true,
        minimumViewTime: stations.length * 60,
    });
    const onViewChanged = useRef(({viewableItems}) => {
        if (viewableItems.length > 0) {
            const selectedPlace = viewableItems[0].item;
            setSelectedId(selectedPlace.id);
        }
    });

    const onSelectingCard = (e) => {
        setShowMaxiCard(!showMaxiCard);
        Animated.timing(stretchAnim, {
            toValue: 400,
            duration: 500,
            // isInteraction: true,
            useNativeDriver: false,
        }).start();
    };

    return (
        <View style={styles.container}>
            {/*/here we warped the AddressAutocomplete component in another view in order to give it a special style */}
            <View style={styles.searchBox}>
                <AddressAutocomplete
                    reference={googleAddress}
                    setCords={setCords}
                    placeHolder={"Search Here..."}
                    styleTag={"styleSearch"}
                    setViewPort={setViewPort}
                />
                <MaterialCommunityIcons
                    name={"magnify"}
                    size={22}
                    style={{alignSelf: "center", marginRight: 20}}
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
                {stations.map((card) => (
                    <Marker
                        key={card.id}
                        title={card.address}
                        coordinate={{
                            latitude: card.cords.lat,
                            longitude: card.cords.lng,
                        }}
                        tappable
                        onPress={() => setSelectedId(card.id)}
                        // image={require("../assets/markers/basic_marker.png")}
                    >
                        <Image
                            source={require("../../assets/markers/basic_marker.png")}
                            style={
                                card.id === selectedId
                                    ? styles.selectedMarker
                                    : styles.regularMarker
                            }
                            resizeMode="contain"
                        />
                    </Marker>
                ))}
            </MapView>
            <View style={{position: "absolute", bottom: 15}}>
                <FlatList
                    ref={flatList}
                    data={stations}
                    renderItem={({
                                     item: {name, address, price, image, time_slots, id, phone},
                                 }) => (
                        <TouchableOpacity onPress={onSelectingCard}>
                            {showMaxiCard ? (
                                <MaxiCard
                                    owner={name}
                                    address={address}
                                    price={price}
                                    image={image}
                                    timeSlots={time_slots}
                                    id={id}
                                    key={id}
                                    style={globalStyles.maxi_card_style}
                                    phone={phone}
                                />
                            ) : (
                                <MiniCard
                                    owner={name}
                                    address={address}
                                    price={price}
                                    image={image}
                                    id={id}
                                    key={id}
                                    style={[
                                        {height: 100},
                                        globalStyles.mini_card,
                                    ]}
                                />
                            )}
                        </TouchableOpacity>
                    )}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    snapToInterval={
                        globalStyles.mini_card.width +
                        2 * globalStyles.mini_card.marginHorizontal
                    }
                    contentContainerStyle={{
                        paddingHorizontal:
                            Platform.OS === "android"
                                ? globalStyles.mini_card.marginHorizontal * 4
                                : 0,
                    }}
                    decelerationRate={"fast"}
                    viewabilityConfig={viewConfig.current}
                    onViewableItemsChanged={onViewChanged.current}
                    onScrollE
                    getItemLayout={(data, index) => ({
                        length: globalStyles.mini_card.width,
                        offset:
                            (globalStyles.mini_card.width +
                                globalStyles.mini_card.marginHorizontal * 2) *
                            index,
                        index,
                    })}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        // justifyContent: "center",
    },
    map: {
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height,
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
        position: "absolute",
        marginTop: Platform.OS === "ios" ? 20 : 40,
        flexDirection: "row",
        backgroundColor: "#fff",
        width: "90%",
        alignSelf: "center",
        borderRadius: 15,
        padding: 0,
        shadowColor: "#ccc",
        shadowOffset: {width: 0, height: 3},
        shadowOpacity: 0.5,
        shadowRadius: 5,
        elevation: 10,
        zIndex: 3,
    },
});
