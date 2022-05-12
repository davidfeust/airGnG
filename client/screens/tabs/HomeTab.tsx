import React, {useContext} from 'react';
import {Text, View} from 'react-native';
import {globalStyles} from "../../assets/styles/globalStyles";
import CustomButton from "../../components/CustomButton";
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
            <CustomButton text={"Logout"} onPress={handleSignOut}/>
            <CustomButton text={"Edit your profile"} onPress={() => navigation.push('UserDetailsScreen')}/>
            {user.admin &&
            <Text style={{color: "red", fontSize:24}}>You have an admin privilege</Text>
            }
        </View>
    );
}
