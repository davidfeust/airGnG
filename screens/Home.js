import React, {useContext} from "react";
import {StyleSheet, Text, View} from "react-native";
import {AuthenticatedUserContext} from "../navigation/AuthenticatedUserProvider";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import SearchStation from "./SearchStation";
import MyOrders from "./MyOrders";
import MyStations from "./MyStations";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import {colors} from "../assets/styles/colors";
import MyButton from "../components/MyButton";
import {globalStyles} from "../assets/styles/globalStyles";
import {auth} from '../config/firebase';

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
    const HomeTab = ({navigation}) => (
        <View style={styles.container}>
            {user.name ?
                <Text style={globalStyles.subTitle}>Hello {user.name}!</Text>
                : <Text style={globalStyles.subTitle}>Hello to you!</Text>
            }
            <MyButton text={"Logout"} onPress={handleSignOut}/>
            {/* TODO: add userDetails after SignUP*/}
            <MyButton text={"Edit your profile"} onPress={() => navigation.push('UserDetails')}/>
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
                name="MyStations"
                component={MyStations}
                options={{
                    tabBarLabel: "My Stations",
                    tabBarIcon: ({color, size}) => (
                        <MaterialCommunityIcons name="ev-station" color={color} size={size}/>
                    ),
                }}
            />
            <Tab.Screen
                name="MyOrders"
                component={MyOrders}
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
});
