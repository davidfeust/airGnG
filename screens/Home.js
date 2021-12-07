import React, {useContext} from "react";
import {Button, StyleSheet, Text, View} from "react-native";
import {getAuth} from "firebase/auth";
import {AuthenticatedUserContext} from "../navigation/AuthenticatedUserProvider";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import SearchStation from "./SearchStation";
import Subscriptions from "./Subscriptions";
import MyPosts from "./MyPosts";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import {colors} from "../assets/styles/colors";

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
                component={SearchStation}
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
                name="MyPosts"
                component={MyPosts}
                options={{
                    tabBarLabel: "My Posts",
                    tabBarIcon: ({color, size}) => (
                        <MaterialCommunityIcons name="post" color={color} size={size}/>
                    ),
                }}
            />
            <Tab.Screen
                name="Subscriptions"
                component={Subscriptions}
                options={{
                    tabBarLabel: "Subscriptions",
                    tabBarIcon: ({color, size}) => (
                        <MaterialCommunityIcons
                            name="ev-station"
                            color={color}
                            size={size}
                        />
                    ),
                }}
            />
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
