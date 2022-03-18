import React from 'react';
import { TimeSlotType } from '../App.d';
import TimeSlot from './TimeSlot';

const CustomDateRangePicker = ({
    start,
    end,
    setSlot,
    minDate,
    maxDate,
}: {
    start: Date;
    end: Date;
    setSlot: ({ start, end }: TimeSlotType) => void;
    minDate?: Date;
    maxDate?: Date;
}) => {
    const inputHandler = (s: Date, e: Date) => {
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
