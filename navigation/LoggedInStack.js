import React from "react";
import {createStackNavigator} from "@react-navigation/stack";
import Home from "../screens/Home";
import StationCard from "../components/StationCard";
import PostStation from "../screens/PostStation";
import EditMyStation from "../components/EditMyStation";
import MyStationCard from "../components/MyStationCard";
import MyPosts from "../screens/MyPosts";

const Stack = createStackNavigator();

export default function LoggedInStack() {
    return (
        <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name="Home" component={Home}/>
            <Stack.Screen name="PostStation" component={PostStation}/>
            <Stack.Screen name="EditMyStation" component={EditMyStation}/>
            <Stack.Screen name="MyStationCard" component={MyStationCard}/>
            <Stack.Screen name="MyPosts" component={MyPosts}/>
        </Stack.Navigator>
    );
}
