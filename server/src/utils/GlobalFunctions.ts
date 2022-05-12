import { collection, getDocs } from 'firebase/firestore';
import { Station } from '../index.d';
import { db, storage } from '../../config/firebase';
export const getFromCol = async (
    colName: string,
    setFun: (map: any[]) => void
) => {
    const col = collection(db, colName);
    const cardsCol = await getDocs(col);
    const map = cardsCol.docs.map((doc) => {
        const id = doc.id;
        const data = doc.data();
        return { id, ...data };
    });
    setFun(map);
    return map;
};
