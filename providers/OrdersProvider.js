import {collection, getDocs, onSnapshot, query, where,} from "firebase/firestore";
import React, {createContext, useContext, useEffect, useState} from "react";
import {db} from "../config/firebase";
import {AuthenticatedUserContext} from "./AuthenticatedUserProvider";

export const OrdersContext = createContext([]);

export const OrdersProvider = ({children}) => {
    const {user} = useContext(AuthenticatedUserContext);
    const [Orders, setOrders] = useState([]);
    const getOrders = async () => {
        const unsubOrders = onSnapshot(collection(db, "orders"),
            async () => {
                const q = query(collection(db, 'orders'), where('station_id', '==', collection(db,'stations').filter((station)=>station.owner_id == user.id)))
                const snap = await getDocs(q);
                setOrders(snap.docs.map(d => d.data()))
            })
    };
    useEffect(getOrders, []);

    return (
        <OrdersContext.Provider value={{Orders, setOrders}}>
            {children}
        </OrdersContext.Provider>
    );
};
