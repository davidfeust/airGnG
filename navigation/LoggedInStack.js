import React, { useEffect, useState, createContext } from "react";

import { createStackNavigator } from "@react-navigation/stack";
import Home from "../screens/Home";

import PostStation from "../screens/PostStation";
import EditMyStation from "../screens/EditMyStation";
import MyStationCard from "../components/MyStationCard";
import MyPosts from "../screens/MyPosts";

import { PublicStationsProvider } from "./PublicStationsProvider";
import { MyOrdersProvider } from "./MyOrdersProvider";

const Stack = createStackNavigator();

export default function LoggedInStack() {
  return (
    <PublicStationsProvider>
      <MyOrdersProvider>
        {/*headerShown: false - hide the names of the screens (usually in the top of the page)*/}
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="PostStation" component={PostStation} />
          <Stack.Screen name="EditMyStation" component={EditMyStation} />
          <Stack.Screen name="MyStationCard" component={MyStationCard} />
          <Stack.Screen name="MyPosts" component={MyPosts} />
        </Stack.Navigator>
      </MyOrdersProvider>
    </PublicStationsProvider>
  );
}
