import React, {useContext} from "react";
import {Button, StyleSheet, Text, View} from "react-native";
import {getAuth} from "firebase/auth";
import {AuthenticatedUserContext} from "../navigation/AuthenticatedUserProvider";
import {NavigationContainer} from "@react-navigation/native";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import PostStation from "./PostStation";
import SubscribeStation from "./SubscribeStation";
import Subscriptions from "./Subscriptions";
import MyPosts from "./MyPosts";

const auth = getAuth();

export default function Home() {
    const {user} = useContext(AuthenticatedUserContext);

    const handleSignOut = async () => {
        try {
            await auth.signOut();
        } catch (error) {
            console.log(error);
        }
    };
    const Tab = createBottomTabNavigator();
    const HomeTab = () => (
        <View style={styles.container}>
            <Text>Home</Text>
            <Text>{user.email}</Text>
            <Button title={"logout"} onPress={handleSignOut}/>
        </View>
    );
    return (
        <Tab.Navigator>
            <Tab.Screen name="HomeTab" component={HomeTab}/>
            <Tab.Screen name="SubscribeStation" component={SubscribeStation}/>
            <Tab.Screen name="MyPosts" component={MyPosts} />
            <Tab.Screen name="Subscriptions" component={Subscriptions}/>
        </Tab.Navigator>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
});
