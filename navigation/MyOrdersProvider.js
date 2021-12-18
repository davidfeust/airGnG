import {collection, getDocs, onSnapshot, query, where,} from "firebase/firestore";
import React, {createContext, useContext, useEffect, useState} from "react";
import {db} from "../config/firebase";
import {AuthenticatedUserContext} from "./AuthenticatedUserProvider";

export const myOrdersContext = createContext([]);

export const MyOrdersProvider = ({children}) => {
    const {user} = useContext(AuthenticatedUserContext);
    const [myOrders, setMyOrders] = useState([]);
    const getMyOrders = async () => {
        const unsubMyOrders = onSnapshot(collection(db, "orders"),
            async () => {
                const q = query(collection(db, 'orders'), where('sub_id', '==', user.uid))
                const snap = await getDocs(q);
                setMyOrders(snap.docs.map(d => d.data()))
            })
    };
    useEffect(getMyOrders, []);

    return (
        <myOrdersContext.Provider value={{myOrders, setMyOrders}}>
            {children}
        </myOrdersContext.Provider>
    );
};
