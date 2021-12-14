import { onSnapshot, collection } from "firebase/firestore";
import React, { useContext, createContext, useEffect, useState } from "react";
import { getFromCol } from "../utils/GlobalFuncitions";
import { db } from "../config/firebase";

export const usersContext = createContext([]);
export const UsersProvider = ({ children }) => {
    const [users, setUsers] = useState([]);
    useEffect(() => {
        const unsubUsersListener = onSnapshot(
            collection(db, "users"),
            (col) => {
                getFromCol("users", setUsers);
            }
        );
    }, []);
    return (
        <usersContext.Provider value={{ users, setUsers }}>
            {children}
        </usersContext.Provider>
    );
};
