import React, { useEffect, useState, createContext } from "react";

import { createStackNavigator } from "@react-navigation/stack";
import Home from "../screens/Home";
import StationCard from "../components/StationCard";
import PostStation from "../screens/PostStation";
import EditMyStation from "../components/EditMyStation";
import MyStationCard from "../components/MyStationCard";
import MyPosts from "../screens/MyPosts";
import { collection, getDocs, onSnapshot } from "firebase/firestore";
import { db } from "../config/firebase";

export const publicStationsContext = createContext([]);
const Stack = createStackNavigator();

export default function LoggedInStack() {
  const [cards, setCards] = useState([]);

  const getCards = async () => {
    const col = collection(db, "postedStation");
    const cards_col = await getDocs(col);
    // cards.forEach((card) => console.log(card.data()));
    setCards(
      cards_col.docs.map((doc) => {
        let id = doc.id;
        let data = doc.data();
        return { id, ...data };
      })
    );
  };
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "postedStation"), (col) => {
      getCards();
    });
  }, []);
  return (
    <publicStationsContext.Provider value={{ cards, setCards }}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="PostStation" component={PostStation} />
        <Stack.Screen name="EditMyStation" component={EditMyStation} />
        <Stack.Screen name="MyStationCard" component={MyStationCard} />
        <Stack.Screen name="MyPosts" component={MyPosts} />
      </Stack.Navigator>
    </publicStationsContext.Provider>
  );
}
