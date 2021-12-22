import {collection, doc, documentId, getDoc, getDocs, onSnapshot, query, where,} from "firebase/firestore";
import React, {createContext, useContext, useEffect, useState} from "react";
import {db} from "../config/firebase";
import {AuthenticatedUserContext} from "./AuthenticatedUserProvider";

export const myOrdersContext = createContext([]);

export const MyOrdersProvider = ({children}) => {
    const {user} = useContext(AuthenticatedUserContext);
    const [myOrders, setMyOrders] = useState([]);
    const [userFromCollection, setUserFromCollection] = useState();

    // const unsubUserFromCollection = onSnapshot(
    //     doc(db, "users", user.uid),
    //     (snap) => {
    //         setUserFromCollection(snap.data());
    //     }
    // );
    const updateMyOrders = async () => {
        if (!user) {
            return;
        }
        const ordersIds = await getDoc(doc(db, "users", user.uid)).then(
            (d) => d.data().orders
        ).catch(err => {
            console.error('***', err);
            throw err;
        });
        if (ordersIds.length > 0) {
            const q = query(
                collection(db, "orders"),
                where(documentId(), "in", ordersIds)
            );
            getDocs(q).then((ds) =>
                setMyOrders(ds.docs.map((d) => ({id: d.id, ...d.data()})))
            ).catch(err => {
                console.error('###', err);
                throw err;
            });
        } else {
            setMyOrders([]);
        }
    };

    useEffect(() => {
        const unsubMyOrders = onSnapshot(
            collection(db, "orders"),
            updateMyOrders
        );
    }, [user]); /* user in the dependency list because updateMyOrders function use user,
    and suppose to run just after the user not null */

    return (
        <myOrdersContext.Provider value={{myOrders, updateMyOrders}}>
            {children}
        </myOrdersContext.Provider>
    );
};
