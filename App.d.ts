import { Timestamp } from 'firebase/firestore';

export type Time = {
    set?: CallableFunction;
    start: Date;
    end: Date;
    minDate?: Date;
    maxDate?: Date;
};

export type Owner = {
    ownerId: string;
    name: string;
};

export type Station = {
    address: string;
    time_slots: Time;
    price: number;
    image: string;
    id: string;
    phone: number;
    owner_id: string;
};

export type Reservation = {
    date_start: Timestamp;
    date_finish: Timestamp;
};

export type CarType = 'BEV' | 'PHEV' | 'HEV';
