import React from "react";

import {createStackNavigator} from "@react-navigation/stack";
import Home from "../screens/Home";

import AddNewStation from "../screens/AddNewStation";
import EditMyStation from "../screens/EditMyStation";
import MyStationCard from "../components/MyStationCard";
import MyStations from "../screens/MyStations";

import {PublicStationsProvider} from "./PublicStationsProvider";
import {MyOrdersProvider} from "./MyOrdersProvider";
import PublishStation from "../screens/PublishStation";
import UserDetails from "../screens/UserDetails";

const Stack = createStackNavigator();

export default function LoggedInStack() {
    return (
        <PublicStationsProvider>
                <MyOrdersProvider>
                    {/* headerShown: false - hide the names of the screens (usually in the top of the page)*/}
                    <Stack.Navigator screenOptions={{headerShown: false}}>
                        <Stack.Screen
                            name="Home"
                            component={Home}/>
                        <Stack.Screen
                            name="AddNewStation"
                            component={AddNewStation}
                        />
                        <Stack.Screen
                            name="EditMyStation"
                            component={EditMyStation}
                        />
                        <Stack.Screen
                            name="MyStationCard"
                            component={MyStationCard}
                        />
                        <Stack.Screen
                            name="PublishStation"
                            component={PublishStation}
                        />
                        <Stack.Screen
                            name="MyStations"
                            component={MyStations}
                        />
                        <Stack.Screen
                            name="UserDetails"
                            component={UserDetails}/>
                    </Stack.Navigator>
                </MyOrdersProvider>
        </PublicStationsProvider>
    );
}
