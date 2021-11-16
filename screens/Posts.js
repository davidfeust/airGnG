import React, { useState } from 'react';
import { StyleSheet} from "react-native";
import { ScrollView } from 'react-native-gesture-handler';

/**
 * represents the page where a user can see the status of his post.
 * for now, its not posible that more than 1 user will subscribe per post,
 * but it might change...
 * @returns <ScrollView>
 */
export default function Posts() {
    
    return ( <ScrollView style={styles.replaceMe}></ScrollView> );
}

const styles = StyleSheet.create({
    replaceMe:{alignItems:'center',},
});