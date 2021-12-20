import React, {useContext} from "react";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import SearchStationTab from "../screens/tabs/SearchStationTab";
import MyOrdersTab from "../screens/tabs/MyOrdersTab";
import MyStationsTab from "../screens/tabs/MyStationsTab";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import {colors} from "../assets/styles/colors";
import HomeTab from "../screens/tabs/HomeTab";
import UsersManagerTab from "../screens/tabs/UsersManagerTab";
import {AuthenticatedUserContext} from "../providers/AuthenticatedUserProvider";

export default function TabsNavigator() {

    const Tab = createBottomTabNavigator();
    const {user} = useContext(AuthenticatedUserContext);


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
                name="My Stations"
                component={MyStationsTab}
                options={{
                    headerShown: true,
                    headerStatusBarHeight: 35,
                    tabBarLabel: "My Stations",
                    tabBarIcon: ({color, size}) => (
                        <MaterialCommunityIcons name="ev-station" color={color} size={size}/>
                    ),
                }}
            />
            {user.admin ?
                <Tab.Screen
                    name="Users Manager"
                    component={UsersManagerTab}
                    options={{
                        headerShown: true,
                        headerStatusBarHeight: 35,
                        tabBarLabel: "Users Manager",
                        tabBarIcon: ({color, size}) => (
                            <MaterialCommunityIcons
                                name="account-edit"
                                color={color}
                                size={size}
                            />
                        ),
                    }}
                />
                :
                <Tab.Screen
                    name="My Orders"
                    component={MyOrdersTab}
                    options={{
                        headerShown: true,
                        headerStatusBarHeight: 35,
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
            }
        </Tab.Navigator>
    );
}
