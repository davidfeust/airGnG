import React, { useContext } from 'react';

import { createStackNavigator } from '@react-navigation/stack';
import TabsNavigator from './TabsNavigator';

import AddNewStationScreen from '../screens/AddNewStationScreen';
import EditMyStationScreen from '../screens/EditMyStationScreen';
import PublishStationScreen from '../screens/PublishStationScreen';
import UserDetailsScreen from '../screens/UserDetailsScreen';
import ReservationFromMeScreen from '../screens/ReservationFromMeScreen';
import { AuthenticatedUserContext } from '../providers/AuthenticatedUserProvider';
import { Text, View } from 'react-native';
import { globalStyles } from '../assets/styles/globalStyles';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import CustomButton from '../components/CustomButton';
import { auth } from '../config/firebase';
import OrderStack from './OrderStack';
import ProfileScreen from '../screens/ProfileScreen';

const Stack = createStackNavigator();

export default function LoggedInStack() {
    const { user } = useContext(AuthenticatedUserContext);

    const created = new Date(user.metadata.creationTime);
    const now = new Date();
    const isNewUser = now.getTime() - created.getTime() < 5000; // if creation time is less then current time, show

    //user blocked view
    if (user.blocked) {
        return (
            <View style={[globalStyles.container, { marginTop: 100 }]}>
                <Text style={globalStyles.title}>You are blocked!</Text>
                <MaterialCommunityIcons
                    name={'block-helper'}
                    size={100}
                    style={{ marginTop: 30 }}
                />
                <Text style={[globalStyles.subTitle, { marginTop: 30 }]}>
                    for more information please email info@airgng.com{' '}
                </Text>
                {/*maybe delete the logout-for inconvenient way to enter again the app */}
                <CustomButton
                    style={{ marginTop: 50 }}
                    text={'Logout'}
                    onPress={async () => {
                        try {
                            await auth.signOut();
                        } catch (error) {
                            console.log(error);
                        }
                    }}
                />
            </View>
        );
    }
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {/* headerShown: false - hide the names of the screens (usually in the top of the page)*/}
            {isNewUser && (
                <Stack.Screen
                    name='UserDetailsScreen'
                    component={UserDetailsScreen}
                />
            )}
            {/* <Stack.Screen name='ProfileScreen' children={()=><ProfileScreen owner={user} navigation={null}/>} /> */}
            <Stack.Screen name='TabsNavigator' component={TabsNavigator} />
                
            <Stack.Screen
                name='AddNewStationScreen'
                component={AddNewStationScreen}
            />
            <Stack.Screen
                name='EditMyStationScreen'
                component={EditMyStationScreen}
            />
            <Stack.Screen
                name='PublishStationScreen'
                component={PublishStationScreen}
            />
            <Stack.Screen
                name='ReservationFromMeScreen'
                component={ReservationFromMeScreen}
            />
            <Stack.Screen name='OrderStack' component={OrderStack} />

            {!isNewUser && (
                <Stack.Screen
                    name='UserDetailsScreen'
                    component={UserDetailsScreen}
                />
            )}
        </Stack.Navigator>
    );
}
