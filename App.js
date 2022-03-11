import React from 'react';
import WrapProviders from './providers/WrapProviders';
import { LogBox, View } from 'react-native';
import { AirbnbRating, Rating } from 'react-native-ratings';

LogBox.ignoreLogs(['Setting a timer']);
LogBox.ignoreLogs(['AsyncStorage']);

export default function App() {
    // return (
    //     <View style={{ marginTop: 100 }}>
    //         {/* <AirbnbRating /> */}
    //         <Rating
    //             style={{ alignSelf: 'center', justifyContent: 'center' }}
    //             onFinishRating={(rating) => {
    //                 console.log(rating);
    //             }}
    //             readonly
    //         />
    //     </View>
    // );
    return <WrapProviders />;
}
