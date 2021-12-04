import React, { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  View,
  Dimensions,
} from "react-native";
import PublicStationCard from "../components/PublicStationCard";
import { publicStationsContext } from "../navigation/PublicStationsProvider";
import MapView, { AnimatedRegion, Marker } from "react-native-maps";
import { globalStyles } from "../assets/styles/globalStyles";
import { AuthenticatedUserContext } from "../navigation/AuthenticatedUserProvider";
import { myOrdersContext } from "../navigation/MyOrdersProvider";

/**
 * create a page with all available stations in the DB,
 * and a button for each to represent subscribing to station.
 * and a listener to that button so the station gets orderd.
 * as soon as the user subscribed for a station,
 * it should be marked as unavailable and removed from this screen
 * @returns <ScrollView>
 */

export default function SearchStation({ navigation }) {
  const { user } = useContext(AuthenticatedUserContext);
  const { cards, orders } = useContext(publicStationsContext);
  const { myOrders } = useContext(myOrdersContext);

  const [availableCards, setAvailableCards] = useState(
    cards.filter(
      (card) => !myOrders.some(({ station_id }) => station_id == card.id)
    )
  );
  const [region, setRegion] = useState({
    latitude: 31.046051,
    longitude: 34.851612,
    latitudeDelta: 4,
    longitudeDelta: 4,
  });

  const onRegionChange = (region) => {
    setRegion(region);
  };

  const updateAvailableCards = () => {
    setAvailableCards(
      cards.filter(
        (card) => !myOrders.some(({ station_id }) => station_id == card.id)
      )
    );
  };

  useEffect(updateAvailableCards, [myOrders]);

  return (
    <View style={styles.container}>
      <MapView
        // region={region}
        onRegionChange={onRegionChange}
        initialRegion={region}
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
          />
        ))}
      </MapView>
      <ScrollView
        snapToInterval={
          globalStyles.mini_card.width +
          globalStyles.mini_card.marginHorizontal * 2
        }
        showsHorizontalScrollIndicator={false}
        horizontal
        pagingEnabled
        style={{
          position: "absolute",
          bottom: 10,
          alignSelf: "center",
        }}
        contentContainerStyle={{ paddingRight: 110 }}
      >
        {availableCards !== [] ? (
          availableCards.map(({ name, address, price, image, date, id }) => (
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
          ))
        ) : (
          <ActivityIndicator size={"large"} color="blue" />
        )}
      </ScrollView>
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
});
