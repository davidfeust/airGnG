import React, { useContext, useState } from "react";
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
  const [region, setRegion] = useState({
    latitude: 31.046051,
    longitude: 34.851612,
    latitudeDelta: 4,
    longitudeDelta: 4,
  });

  const onRegionChange = (region) => {
    setRegion({ region });
  };
  return (
    <View style={styles.container}>
      <MapView
        region={region}
        onRegionChange={onRegionChange}
        initialRegion={region}
        style={styles.map}
      >
        {cards.map((card) => (
          <Marker
            key={card.id}
            title={card.address}
            coordinate={{ latitude: card.cords.lat, longitude: card.cords.lng }}
          />
        ))}
      </MapView>
      <ScrollView horizontal style={{ position: "absolute", bottom: 10 }}>
        {cards !== [] ? (
          cards.map(({ name, address, price, image, date, id }) => (
            <PublicStationCard
              owner={name}
              address={address}
              price={price}
              image={image}
              date={date}
              id={id}
              key={id}
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
