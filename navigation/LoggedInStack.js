import React, {useContext} from "react";

import {createStackNavigator} from "@react-navigation/stack";
import TabsNavigator from "./TabsNavigator";

import AddNewStationScreen from "../screens/AddNewStationScreen";
import EditMyStationScreen from "../screens/EditMyStationScreen";
import MyStationCard from "../components/MyStationCard";
import MyStationsTab from "../screens/tabs/MyStationsTab";
import PublishStationScreen from "../screens/PublishStationScreen";
import UserDetailsScreen from "../screens/UserDetailsScreen";
import {AuthenticatedUserContext} from "../providers/AuthenticatedUserProvider";
import {Text, View} from "react-native";
import {globalStyles} from "../assets/styles/globalStyles";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import CustomButton from "../components/CustomButton";
import {auth} from "../config/firebase";

const Stack = createStackNavigator();

export default function LoggedInStack() {
    const {user} = useContext(AuthenticatedUserContext);

    const created = new Date(user.metadata.creationTime);
    const now = new Date();
    const isNewUser = now - created < 5000; // if creation time is less then current time, show

    //user blocked view
    if (user.blocked) {
        return (
            <View style={[globalStyles.container, {marginTop: 100}]}>
                <Text style={globalStyles.title}>You are blocked!</Text>
                <MaterialCommunityIcons name={'block-helper'} size={100} style={{marginTop: 30}}/>
                <Text style={[globalStyles.subTitle, {marginTop: 30}]}>for more information please email
                    info@airgng.com </Text>

                <CustomButton style={{marginTop: 30}} text={"Logout"} onPress={
                    async () => {
                    try {
                    await auth.signOut();
                } catch (error) {
                    console.log(error);
                }
                }}/>

            </View>
        );
    }
    return (
        <Stack.Navigator screenOptions={{headerShown: false}}>
            {/* headerShown: false - hide the names of the screens (usually in the top of the page)*/}
            {isNewUser && (
                <Stack.Screen
                    name="UserDetailsScreen"
                    component={UserDetailsScreen}
                />
            )}

            <Stack.Screen name="TabsNavigator" component={TabsNavigator}/>
            <Stack.Screen
                name="AddNewStationScreen"
                component={AddNewStationScreen}
            />
            <Stack.Screen
                name="EditMyStationScreen"
                component={EditMyStationScreen}
            />
            <Stack.Screen
                name="MyStationCard"
                component={MyStationCard}
            />
            <Stack.Screen
                name="PublishStationScreen"
                component={PublishStationScreen}
            />
            <Stack.Screen
                name="MyStationsTab"
                component={MyStationsTab}
            />
            {!isNewUser && (
                <Stack.Screen
                    name="UserDetailsScreen"
                    component={UserDetailsScreen}
                />
            )}
        </Stack.Navigator>
    );
}
