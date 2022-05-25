import { Modal, StyleSheet, Text, TextInput, View } from "react-native";
import { Rating, AirbnbRating } from "react-native-ratings";
import React, { useContext, useEffect, useState} from 'react';
import { AuthenticatedUserContext } from '../providers/AuthenticatedUserProvider';


// import {Ratings} from './Ratings';

/**
 *  this component is for read only rating *With the number of ranks*
 * @returns
 */

export default function Ratings({ratingProps}) {
    //the order user details
    const { user } = useContext(AuthenticatedUserContext);

    return (
        <View >
            <Rating
                startingValue={ratingProps?.defaultRating}
                readonly = {true}
                imageSize={ratingProps?.size }
                
                showRating={false}
            />
            <Text>( {user?.reviews?.length} )</Text>
        </View>
    );
}

const styles = StyleSheet.create({
  containerStyle: {
      flex: 1,
  },
  modalView: {
      margin: 20,
      backgroundColor: 'white',
      borderRadius: 20,
      padding: 35,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
          width: 0,
          height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
      // position: 'absolute',
      // bottom: 20,
  },
});