import React, {useEffect, useState} from "react";
import {ActivityIndicator, Button, ScrollView, StyleSheet,} from "react-native";
import {collection, getDocs} from "firebase/firestore";
import {db} from "../config/firebase";
import PublicStationCard from "../components/PublicStationCard";

/**
 * create a page with all available stations in the DB,
 * and a button for each to represent subscribing to station.
 * and a listener to that button so the station gets orderd.
 * as soon as the user subscribed for a station,
 * it should be marked as unavailable and removed from this screen
 * @returns <ScrollView>
 */
async function getCards() {
    const col = collection(db, "postedStation");
    const cards = await getDocs(col);
    cards.forEach((card) => console.log(card.data()));
    return cards;
}

export default function SubscribeStation({navigation}) {
    const [cards, setCards] = useState([]);

    const getCards = async () => {
        const col = collection(db, "postedStation");
        const cards_col = await getDocs(col);
        // cards.forEach((card) => console.log(card.data()));
        setCards(cards_col.docs.map(doc => {
            let id = doc.id;
            let data = doc.data()
            return {id, ...data};
        }));
    }

    useEffect(() => {
        navigation.addListener('focus', getCards)
    }, []);

    return (
        <ScrollView>
            {cards != [] ? (
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
