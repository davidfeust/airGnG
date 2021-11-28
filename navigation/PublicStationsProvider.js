import React, {useState, createContext, useEffect} from "react";
import {collection, getDocs, onSnapshot} from "firebase/firestore";
import {db} from "../config/firebase";

export const publicStationsContext = createContext([]);

export const PublicStationsProvider = ({ children }) => {
    const [cards, setCards] = useState([]);

    const getCards = async () => {
        const col = collection(db, "postedStation");
        const cards_col = await getDocs(col);
        setCards(
            cards_col.docs.map((doc) => {
                let id = doc.id;
                let data = doc.data();
                return {id, ...data};
            })
        );
    };

    useEffect(() => {
        const unsub = onSnapshot(collection(db, "postedStation"), (col) => {
            getCards();
        });
    }, []);


    return (
        <publicStationsContext.Provider value={{ cards, setCards }}>
            {children}
        </publicStationsContext.Provider>
    );
};
