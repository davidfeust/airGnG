import React, {useContext} from 'react';
import {Text, View} from 'react-native';
import {globalStyles} from "../../assets/styles/globalStyles";
import MyButton from "../../components/MyButton";
import {AuthenticatedUserContext} from "../../providers/AuthenticatedUserProvider";
import {auth} from "../../config/firebase";


export default function HomeTab({navigation}) {
    const {user} = useContext(AuthenticatedUserContext);

    const handleSignOut = async () => {
        try {
            await auth.signOut();
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <View style={[globalStyles.container, {justifyContent: "center"}]}>
            {user.name ?
                <Text style={globalStyles.subTitle}>Hello {user.name}!</Text>
                : <Text style={globalStyles.subTitle}>Hello to you!</Text>
            }
            <MyButton text={"Logout"} onPress={handleSignOut}/>
            {/* TODO: add userDetails after SignUP*/}
            <MyButton text={"Edit your profile"} onPress={() => navigation.push('UserDetailsScreen')}/>
        </View>
    );
}