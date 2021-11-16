import React, { useState } from 'react';
import { StyleSheet} from "react-native";

/**
 * create a page where the user fills a form
 * on submitting, the user returns to previouse screen,
 * and a listener uploads the data to fire base as js object
 * @returns <form>
 */
export default function PostStation() {
    
    return ( <form style={styles.replaceMe}></form> );
}

const styles = StyleSheet.create({
    replaceMe:{alignItems:'center',},
});