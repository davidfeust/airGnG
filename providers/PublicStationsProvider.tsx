import React, { createContext, useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';
import { getFromCol } from '../utils/GlobalFuncitions';

export const publicStationsContext = createContext({ stations: [] });

export const PublicStationsProvider = ({ children }) => {
    const [stations, setStations] = useState([]);

    useEffect(() => {
        // listener of firebase DB, call getFromCol() in case the data has changed
        const unsubPosted = onSnapshot(collection(db, 'stations'), () => {
            getFromCol('stations', setStations);
        });
    }, []);

    return (
        <publicStationsContext.Provider value={{ stations: stations }}>
            {children}
        </publicStationsContext.Provider>
    );
};
