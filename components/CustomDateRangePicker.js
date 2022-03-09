import React, { useState } from 'react';
import DateRangePicker from 'react-native-daterange-picker';
import { Text, StyleSheet, View } from 'react-native';
import moment from 'moment';
import TimeSlot from './TimeSlot';

const CustomDateRangePicker = ({ start, end, setSlot, minDate, maxDate }) => {
    const inputHandler = (s, e) => {
        if (s) {
            if (s > end) {
                console.log('here!!!!');
                // start time is after end time
                end.setDate(s.getDate());
                end.setHours(s.getHours() + 1);
            }

            setSlot({ start: minDate && minDate > s ? minDate : s, end });
            return;
        }
        if (e) {
            if (start > e) {
                // end time is before start time
                start.setDate(e.getDate());
                start.setHours(e.getHours() - 1);
            }
            setSlot({ start, end: maxDate && maxDate < e ? maxDate : e });
            return;
        }
    };

    return (
        <TimeSlot
            start={start}
            end={end}
            set={inputHandler}
            minDate={minDate}
            maxDate={maxDate}
        />
    );
};

export default CustomDateRangePicker;
const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
