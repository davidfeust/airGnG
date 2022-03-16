import React from 'react';
import { StyleSheet, View } from 'react-native';
import PickTime from './PickTime';
type Time = {
    set?: CallableFunction;
    start: Date;
    end: Date;
    minDate?: Date;
    maxDate?: Date;
};
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
