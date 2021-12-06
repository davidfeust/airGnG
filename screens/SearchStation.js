import React, { useContext, useEffect, useRef, useState } from "react";
import { Dimensions, FlatList, Platform, StyleSheet, View } from "react-native";
import PublicStationCard from "../components/PublicStationCard";
import { publicStationsContext } from "../navigation/PublicStationsProvider";
import MapView, { Marker } from "react-native-maps";
import { globalStyles } from "../assets/styles/globalStyles";
import { AuthenticatedUserContext } from "../navigation/AuthenticatedUserProvider";
import { myOrdersContext } from "../navigation/MyOrdersProvider";
import { Image } from "react-native-elements";
import { colors } from "../assets/styles/colors";

/**
 * create a page with all available stations in the DB,
 * and a button for each to represent subscribing to station.
 * and a listener to that button so the station gets orderd.
 * as soon as the user subscribed for a station,
 * it should be marked as unavailable and removed from this screen
 * @returns <ScrollView>
 */

export default function SearchStation({ navigation }) {
    const { cards } = useContext(publicStationsContext);
    const { myOrders } = useContext(myOrdersContext);
    const [availableCards, setAvailableCards] = useState(
        cards.filter(
            (card) => !myOrders.some(({ station_id }) => station_id === card.id)
        )
    );

    const [selectedId, setSelectedId] = useState(null);

    const updateAvailableCards = () => {
        setAvailableCards(
            cards.filter(
                (card) =>
                    !myOrders.some(({ station_id }) => station_id === card.id)
            )
        );
    };

    useEffect(updateAvailableCards, [myOrders]);

    useEffect(() => {
        if (!selectedId || !flatList) {
            return;
        }
        const index = availableCards.findIndex(
            (card) => card.id === selectedId
        );

        flatList.current.scrollToIndex({ index, animated: true });

        const selectedPlace = availableCards[index];
        const region = {
            latitude: selectedPlace.cords.lat,
            longitude: selectedPlace.cords.lng,
            latitudeDelta: 0.8,
            longitudeDelta: 0.8,
        };
        map.current.animateToRegion(region);
    }, [selectedId]);

    const map = useRef();
    const flatList = useRef();

    const viewConfig = useRef({
        itemVisiblePercentThreshold: 70,
        waitForInteraction: true,
        minimumViewTime: availableCards.length * 60,
    });
    const onViewChanged = useRef(({ viewableItems }) => {
        if (viewableItems.length > 0) {
            const selectedPlace = viewableItems[0].item;
            setSelectedId(selectedPlace.id);
        }
    });

    return (
        <View style={styles.container}>
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
                {availableCards.map((card) => (
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
                            source={require("../assets/markers/basic_marker.png")}
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
            <View style={{ position: "absolute", bottom: 15 }}>
                <FlatList
                    ref={flatList}
                    data={availableCards}
                    renderItem={({
                        item: { name, address, price, image, date, id },
                    }) => (
                        <PublicStationCard
                            owner={name}
                            address={address}
                            price={price}
                            image={image}
                            date={date}
                            id={id}
                            key={id}
                            style={globalStyles.mini_card}
                        />
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
        justifyContent: "center",
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
});
