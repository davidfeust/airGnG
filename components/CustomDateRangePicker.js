import React, { useState } from 'react';
import DateRangePicker from 'react-native-daterange-picker';
import { Text, StyleSheet, View } from 'react-native';
import moment from 'moment';
import TimeSlot from './TimeSlot';

const CustomDateRangePicker = ({ minDate, maxDate, setStart, setEnd }) => {
    const [myStart, setMyStart] = useState(null);
    const [myEnd, setMyEnd] = useState(null);
    return (
        <DateRangePicker
            onChange={({ startDate, endDate }) => {
                if (startDate !== undefined) {
                    setMyStart(startDate);
                    setStart(startDate);
                }
                if (endDate !== undefined) {
                    setMyEnd(endDate);
                    setEnd(endDate);
                    // endDate && setShow(false);
                }
            }}
            startDate={myStart}
            endDate={myEnd}
            minDate={moment(minDate)}
            maxDate={moment(maxDate)}
            range
            displayedDate={moment(minDate)}
            backdropStyle={{ opacity: 1 }}

            // open={show}
        >
            <View style={{ marginVertical: 20 }}>
                <TimeSlot
                    start={myStart ? myStart.toDate() : minDate}
                    end={myEnd ? myEnd.toDate() : maxDate}
                />
            </View>
        </DateRangePicker>
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
