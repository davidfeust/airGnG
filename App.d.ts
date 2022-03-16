export type Time = {
    set?: CallableFunction;
    start: Date;
    end: Date;
    minDate?: Date;
    maxDate?: Date;
};

export type Owner = {
    ownerId: string;
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
