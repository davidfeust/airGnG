import { User } from 'firebase/auth';
import { DocumentData, Timestamp } from 'firebase/firestore';
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

export type Order = {
    id: number;
    user_id: number;
    station_id: number;
    reservation: Reservation;
    order_date: Date;
};
export type AirGnGUser = DocumentData &
    User & {
        name: string;
        reviews: Review[];
        orders: Order[];
    };

interface Station extends DocumentData {
    id: string;
    address: string;
    time_slots?: Time[];
    price: number;
    image: string;
    phone: number;
    owner_id: string;
    cords: LatLng;
    plugType: PlugType;
}

export type Reservation = {
    date_start: Timestamp;
    date_finish: Timestamp;
};

export type Review = {
    rating: number;
    comment: string;
    reviewer_id: string;
};

export type PlugType = 'BEV' | 'PHEV' | 'HEV';
