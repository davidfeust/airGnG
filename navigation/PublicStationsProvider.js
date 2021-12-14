import React, { useState, createContext, useEffect } from "react";
import {
    collection,
    getDocs,
    onSnapshot,
    query,
    where,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { getFromCol } from "../utils/GlobalFuncitions";

export const publicStationsContext = createContext([]);

export const PublicStationsProvider = ({ children }) => {
    const [cards, setCards] = useState([]);
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        // listener of firebase DB, call getFromCol() in case the data has changed
        const unsubPosted = onSnapshot(
            collection(db, "postedStation"),
            (col) => {
                getFromCol("postedStation", setCards);
            }
        );
        const unsubOrdered = onSnapshot(
            collection(db, "subscriptions"),
            (col) => {
                getFromCol("subscriptions", setOrders);
            }
        );
    }, []);

    return (
        <publicStationsContext.Provider
            value={{ cards, setCards, orders, setOrders }}
        >
            {children}
        </publicStationsContext.Provider>
    );
};
