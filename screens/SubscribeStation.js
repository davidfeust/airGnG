import React, { useEffect, useState } from "react";
import { StyleSheet, Button, Text, ScrollView } from "react-native";
import StationCard from "../components/StationCard";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";

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

export default function SubscribeStation() {
  const [cards, setCards] = useState([]);
  useEffect(() => {
    const getCards = async () => {
      const col = collection(db, "postedStation");
      const cards_col = await getDocs(col);
      // cards.forEach((card) => console.log(card.data()));
      setCards(cards_col.docs.map((doc) => doc.data()));
    };
    getCards();
  }, []);
  return (
    <ScrollView>
      {cards != []
        ? cards.map(({ name, address, price, image, date }) => (
            <StationCard
              owner={name}
              address={address}
              price={price}
              image={image}
              date={date}
            />
          ))
        : null}
      <Button title="press" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  // replaceMe:{alignItems:'center',},
});
