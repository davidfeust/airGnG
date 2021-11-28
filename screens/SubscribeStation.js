import React, {useContext} from "react";
import {
    ActivityIndicator,
    Button,
    ScrollView,
    StyleSheet,
} from "react-native";
import PublicStationCard from "../components/PublicStationCard";
import {publicStationsContext} from "../navigation/PublicStationsProvider";

/**
 * create a page with all available stations in the DB,
 * and a button for each to represent subscribing to station.
 * and a listener to that button so the station gets orderd.
 * as soon as the user subscribed for a station,
 * it should be marked as unavailable and removed from this screen
 * @returns <ScrollView>
 */

export default function SubscribeStation({navigation}) {
    const {cards} = useContext(publicStationsContext);

    return (
        <ScrollView>
            {cards !== [] ? (
                cards.map(({name, address, price, image, date, id}) => (
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
                <ActivityIndicator size={"large"} color="blue"/>
            )}
            <Button title="press"/>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    // replaceMe:{alignItems:'center',},
});
