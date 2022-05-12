import { User } from 'firebase/auth';
import { DocumentData, Timestamp } from 'firebase/firestore';

export interface Point {
    lat: number;
    lng: number;
}

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
    id: string;
    user_id: string;
    station_id: string;
    reservation: Reservation;
    order_date: Timestamp;
    paid: boolean;
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
    cords: Point;
    plug_type: PlugType;
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
