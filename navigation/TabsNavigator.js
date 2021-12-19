import React from "react";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import SearchStationTab from "../screens/tabs/SearchStationTab";
import MyOrdersTab from "../screens/tabs/MyOrdersTab";
import MyStationsTab from "../screens/tabs/MyStationsTab";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import {colors} from "../assets/styles/colors";
import HomeTab from "../screens/tabs/HomeTab";

export default function TabsNavigator() {

    const Tab = createBottomTabNavigator();


    return (
        <Tab.Navigator screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: colors.secondary
        }}>
            <Tab.Screen
                name="HomeTab"
                component={HomeTab}
                options={{
                    tabBarLabel: "Home",
                    tabBarIcon: ({color, size}) => (
                        <MaterialCommunityIcons name="home" color={color} size={size}/>
                    ),
                }}
            />
            <Tab.Screen
                name="SearchStation"
                component={SearchStationTab}
                options={{
                    tabBarLabel: "Search Station",
                    tabBarIcon: ({color, size}) => (
                        <MaterialCommunityIcons
                            name="magnify"
                            color={color}
                            size={size}
                        />
                    ),
                }}
            />
            <Tab.Screen
                name="MyStations"
                component={MyStationsTab}
                options={{
                    tabBarLabel: "My Stations",
                    tabBarIcon: ({color, size}) => (
                        <MaterialCommunityIcons name="ev-station" color={color} size={size}/>
                    ),
                }}
            />
            <Tab.Screen
                name="MyOrders"
                component={MyOrdersTab}
                options={{
                    tabBarLabel: "My Orders",
                    tabBarIcon: ({color, size}) => (
                        <MaterialCommunityIcons
                            name="post"
                            color={color}
                            size={size}
                        />
                    ),
                }}
            />
        </Tab.Navigator>
    );
}