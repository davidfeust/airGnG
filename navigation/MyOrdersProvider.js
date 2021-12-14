import { async } from "@firebase/util";
import {
    collection,
    doc,
    documentId,
    getDoc,
    getDocs,
    query,
    where,
} from "firebase/firestore";
import React, { useState, createContext, useContext, useEffect } from "react";
import { db } from "../config/firebase";
import { AuthenticatedUserContext } from "./AuthenticatedUserProvider";
import { publicStationsContext } from "./PublicStationsProvider";
import { usersContext } from "./UsersProvider";

export const myOrdersContext = createContext([]);

export const MyOrdersProvider = ({ children }) => {
    const { user } = useContext(AuthenticatedUserContext);
    const { users } = useContext(usersContext);
    const { orders } = useContext(publicStationsContext);
    const [myOrders, setMyOrders] = useState([]);
    const getMyOrders = async () => {
        const userSnap = await getDoc(doc(db, "users", user.uid));
        if (userSnap.exists()) {
            const myOrdersIds = userSnap.get("orders");

            if (myOrdersIds.length > 0) {
                getDocs(
                    query(
                        collection(db, "subscriptions"),
                        where(documentId(), "in", myOrdersIds)
                    )
                ).then((docs) => setMyOrders(docs.docs.map((d) => d.data())));
            } else {
                setMyOrders([]);
            }
        }
    };
    useEffect(getMyOrders, [orders, users]);
    return (
        <myOrdersContext.Provider value={{ myOrders, setMyOrders }}>
            {children}
        </myOrdersContext.Provider>
    );
};
