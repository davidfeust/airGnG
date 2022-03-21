import React from "react";
import {createStackNavigator} from "@react-navigation/stack";
import SignInScreen from "../screens/SignInScreen";
import WelcomeScreen from "../screens/WelcomeScreen";
import SignUpScreen from "../screens/SignUpScreen";

const Stack = createStackNavigator();

export default function AuthStack() {
    return (
        <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name="WelcomeScreen" component={WelcomeScreen}/>
            <Stack.Screen name="SignInScreen" component={SignInScreen}/>
            <Stack.Screen name="SignUpScreen" component={SignUpScreen}/>
        </Stack.Navigator>
    );
}
