import React from 'react';
import {StyleSheet, View} from 'react-native';
import PickTime from "./PickTime";


export default function TimeSlot({index, set, start, end}) {

    return (
        <View style={styles.container}>
            <PickTime index={index} identifyRange={'start'} set={set} time={start}/>
            <PickTime index={index} identifyRange={'end'} set={set} time={end} minTime={start}/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 7,
        borderWidth: 1,
        margin: 5,
        width: '80%',
        alignSelf: "center"
    }
});
