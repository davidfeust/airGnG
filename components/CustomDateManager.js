import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../assets/styles/colors';
import TimeSlot from './TimeSlot';
import { getStartAndEndTime } from '../utils/GlobalFuncitions';
import CustomDateRangePicker from './CustomDateRangePicker';
import { replace } from 'formik';

export default function CustomDateManager({ setTimeSlots, timeSlots }) {
    const removeTimeSlot = (key) => {
        timeSlots.splice(key, 1);
        setTimeSlots([...timeSlots]);
    };

    const addTimeSlot = () => {
        const temp = [...timeSlots];
        temp.push(getStartAndEndTime());
        setTimeSlots(temp);
    };

    return (
        <View style={{ width: '100%' }}>
            {timeSlots
                ? timeSlots.map((timeSlot, key) => (
                      <View
                          key={key}
                          style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              paddingHorizontal: 40,
                              width: '100%',
                          }}
                      >
                          <CustomDateRangePicker
                              start={timeSlot.start}
                              end={timeSlot.end}
                              setSlot={(val) => {
                                  timeSlots.splice(key, 1, val);
                                  setTimeSlots([...timeSlots]);
                              }}
                              minDate={timeSlot.start}
                          />
                          <TouchableOpacity
                              onPress={() => removeTimeSlot(key)}
                              disabled={timeSlots.length === 0}
                          >
                              <MaterialCommunityIcons
                                  name='minus-circle'
                                  color={
                                      timeSlots.length !== 1
                                          ? colors.primary
                                          : colors.invalid
                                  }
                                  size={30}
                              />
                          </TouchableOpacity>
                      </View>
                  ))
                : null}

            <TouchableOpacity
                onPress={addTimeSlot}
                style={{
                    alignSelf: 'center',
                    flexDirection: 'row',
                    alignItems: 'center',
                }}
            >
                <Text style={{ paddingHorizontal: 10 }}>Add time slot</Text>
                <MaterialCommunityIcons
                    name='plus-circle'
                    color={colors.primary}
                    size={30}
                />
            </TouchableOpacity>
        </View>
    );
}
