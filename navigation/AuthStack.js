import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import SignIn from "../screens/SignIn";
import Welcome from "../screens/Welcome";
import SignUp from "../screens/SignUp";

const Stack = createStackNavigator();

export default function AuthStack() {
    return (
        <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name="Welcome" component={Welcome}/>
            <Stack.Screen name="SignIn" component={SignIn}/>
            <Stack.Screen name="SignUp" component={SignUp}/>
        </Stack.Navigator>
    );
}

