import { Timestamp } from 'firebase/firestore';
import { LatLng } from 'react-native-maps';

export type Time = {
    set?: (start: Date | null, end: Date | null) => void;
    start: Date;
    end: Date;
    minDate?: Date;
    maxDate?: Date;
};

export type TimeSlotType = {
    start: Date;
    end: Date;
};

export type Owner = {
    ownerId: string;
    name: string;
};

export type Station = {
    address: string;
    time_slots?: Time;
    price: number;
    image: string;
    id: string;
    phone: number;
    owner_id: string;
    cords?: LatLng;
    shadowed?: boolean;
    plugType: PlugType;
};

export type Reservation = {
    date_start: Timestamp;
    date_finish: Timestamp;
};

export type PlugType = 'BEV' | 'PHEV' | 'HEV';
