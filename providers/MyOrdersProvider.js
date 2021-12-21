import {
    collection,
    doc,
    getDoc,
    getDocs,
    onSnapshot,
    query,
    where,
} from "firebase/firestore";
import React, { createContext, useContext, useEffect, useState } from "react";
import { db } from "../config/firebase";
import { AuthenticatedUserContext } from "./AuthenticatedUserProvider";
import { documentId } from "firebase/firestore";

export const myOrdersContext = createContext([]);

export const MyOrdersProvider = ({ children }) => {
    const { user } = useContext(AuthenticatedUserContext);
    const [myOrders, setMyOrders] = useState([]);
    const [userFromCollection, setUserFromCollection] = useState();

    // const unsubUserFromCollection = onSnapshot(
    //     doc(db, "users", user.uid),
    //     (snap) => {
    //         setUserFromCollection(snap.data());
    //     }
    // );
    const updateMyOrders = async () => {
        console.log("hi");

        const ordersIds = await getDoc(doc(db, "users", user.uid)).then(
            (d) => d.data().orders
        );
        if (ordersIds.length > 0) {
            const q = query(
                collection(db, "orders"),
                where(documentId(), "in", ordersIds)
            );
            getDocs(q).then((ds) =>
                setMyOrders(ds.docs.map((d) => ({ id: d.id, ...d.data() })))
            );
        } else {
            setMyOrders([]);
        }
    };
    useEffect(() => {
        const unsubMyOrders = onSnapshot(
            collection(db, "orders"),
            updateMyOrders
        );
    }, []);

    return (
        <myOrdersContext.Provider value={{ myOrders, updateMyOrders }}>
            {children}
        </myOrdersContext.Provider>
    );
};
