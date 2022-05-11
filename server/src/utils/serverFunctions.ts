import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';

export const getFromCol = async (colName: string) => {
    const col = collection(db, colName);
    const cardsCol = await getDocs(col);
    const map = cardsCol.docs.map((doc) => {
        const id = doc.id;
        const data = doc.data();
        return { id, ...data };
    });
    return map;
};
