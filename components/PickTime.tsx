import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Platform, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../assets/styles/colors';
import { dateToString } from '../utils/GlobalFuncitions';
import DateTimePicker, { Event } from '@react-native-community/datetimepicker';

type Mode = 'date' | 'time';

const PickTime = ({
    set,
    time,
    identifyRange,
    minTime = null,
    maxTime = null,
}: {
    set: (start: Date | null, end: Date | null) => void;
    time: Date;
    identifyRange: 'start' | 'end';
    minTime: Date;
    maxTime: Date;
}) => {
    const [mode, setMode]: [Mode, CallableFunction] = useState('date');
    const [show, setShow] = useState(false);

    const onChange = (event: Event, selectedDate: Date) => {
        setShow(Platform.OS === 'ios');
        if (mode === 'date') {
            const currentDate = selectedDate || time;
            if (identifyRange === 'start') {
                set(currentDate, null);
            } else {
                set(null, currentDate);
            }
            setMode('time');
            setShow(Platform.OS !== 'ios');
        } else {
            const currentDate = selectedDate || time;
            if (identifyRange === 'start') {
                set(currentDate, null);
            } else {
                set(null, currentDate);
            }
        }
    };

    const showMode = (currentMode: Mode) => {
        setShow(true);
        setMode(currentMode);
    };

    const showDatepicker = () => {
        showMode('date');
    };

    return (
        <View>
            <View
                style={{
                    width: '100%',
                    alignItems: 'center',
                    paddingHorizontal: 10,
                    paddingVertical: 4,
                    justifyContent: 'center',
                }}
            >
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        width: '100%',
                    }}
                >
                    <Text style={{ alignSelf: 'center' }}>
                        {identifyRange}:{'\t\t'}{' '}
                        {time ? dateToString(time) : ''}
                    </Text>
                    {set && (
                        <TouchableOpacity onPress={showDatepicker}>
                            <MaterialCommunityIcons
                                name='calendar'
                                color={colors.primary}
                                size={30}
                            />
                        </TouchableOpacity>
                    )}
                </View>
            </View>
            {show && set && (
                <DateTimePicker
                    value={time}
                    mode={mode}
                    is24Hour={true}
                    display='default'
                    onChange={onChange}
                    minimumDate={minTime}
                    maximumDate={maxTime}
                    minuteInterval={15}
                />
            )}
        </View>
    );
};
export default PickTime;
