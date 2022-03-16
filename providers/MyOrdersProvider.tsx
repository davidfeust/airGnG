import {
    collection,
    doc,
    documentId,
    getDocs,
    onSnapshot,
    query,
    where,
} from 'firebase/firestore';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { db } from '../config/firebase';
import { AuthenticatedUserContext } from './AuthenticatedUserProvider';

export const myOrdersContext = createContext({});

export const MyOrdersProvider = ({ children }) => {
    const { user } = useContext(AuthenticatedUserContext);
    const [myOrders, setMyOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const updateMyOrders = async (snap) => {
        if (!snap.exists()) {
            setMyOrders([]);
            return;
        }
        const ordersArray = snap.data().orders;
        if (ordersArray.length > 0) {
            setIsLoading(true);
            const q = query(
                collection(db, 'orders'),
                where(documentId(), 'in', ordersArray)
            );
            getDocs(q)
                .then((ds) =>
                    setMyOrders(ds.docs.map((d) => ({ id: d.id, ...d.data() })))
                )
                .catch((err) => {
                    console.error(err);
                })
                .finally(() => setIsLoading(false));
        } else {
            setMyOrders([]);
        }
    };

    useEffect(() => {
        if (user) {
            const unsubMyOrders = onSnapshot(
                doc(db, 'users', user.uid),
                updateMyOrders
            );
        }
    }, [
        user,
    ]); /* user in the dependency list because updateMyOrders function use user,
    and suppose to run just after the user not null */

    return (
        <myOrdersContext.Provider value={{ myOrders, isLoading }}>
            {children}
        </myOrdersContext.Provider>
    );
};
