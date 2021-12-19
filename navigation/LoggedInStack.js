import React, { useContext } from "react";

import { createStackNavigator } from "@react-navigation/stack";
import Home from "../screens/Home";

import AddNewStation from "../screens/AddNewStation";
import EditMyStation from "../screens/EditMyStation";
import MyStationCard from "../components/MyStationCard";
import MyStations from "../screens/MyStations";

import { PublicStationsProvider } from "./PublicStationsProvider";
import { MyOrdersProvider } from "./MyOrdersProvider";
import PublishStation from "../screens/PublishStation";
import UserDetails from "../screens/UserDetails";
import { AuthenticatedUserContext } from "./AuthenticatedUserProvider";
import { OrdersProvider } from "./OrdersProvider";

const Stack = createStackNavigator();

export default function LoggedInStack() {
    const { user } = useContext(AuthenticatedUserContext);

    const created = new Date(user.metadata.creationTime);
    const now = new Date();
    const isNewUser = now - created < 5000; // if creation time is less then current time, show

    return (
        <PublicStationsProvider>
            <MyOrdersProvider>
                <OrdersProvider>
                    {/* headerShown: false - hide the names of the screens (usually in the top of the page)*/}
                    <Stack.Navigator screenOptions={{ headerShown: false }}>
                        {isNewUser && (
                            <Stack.Screen
                                name="UserDetails"
                                component={UserDetails}
                            />
                        )}

                        <Stack.Screen name="Home" component={Home} />
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
                        {!isNewUser && (
                            <Stack.Screen
                                name="UserDetails"
                                component={UserDetails}
                            />
                        )}
                    </Stack.Navigator>
                </OrdersProvider>
            </MyOrdersProvider>
        </PublicStationsProvider>
    );
}
