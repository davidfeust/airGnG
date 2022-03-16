import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Time } from '../App.d';
import PickTime from './PickTime';

export default function TimeSlot({ set, start, end, minDate, maxDate }: Time) {
    return (
        <View style={styles.container}>
            <PickTime
                identifyRange={'start'}
                set={set}
                time={start}
                minTime={minDate}
                maxTime={maxDate}
            />
            <PickTime
                identifyRange={'end'}
                set={set}
                time={end}
                minTime={minDate}
                maxTime={maxDate}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 7,
        borderWidth: 1,
        margin: 5,
        width: '80%',
        alignSelf: 'center',
    },
});
