// (/stations)
import express, { Request } from 'express';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Station } from './index.d';
import { getFromCol } from './utils/GlobalFunctions';

const router = express.Router();

router.use((req, res, next) => {
    // console.log('Time: ', Date.now());
    next();
});

router.get('/', async (req, res) => {
    // tslint:disable-next-line:no-console
    console.log('got request for stations');
    let stations: Station[];
    await getFromCol('stations', (map) => {
        stations = map;
    });
    res.json(stations);
});

router.get('/:id', async (req: Request<{ id: string }>, res) => {
    // tslint:disable-next-line:no-console
    console.log('got request for station:' + req.params.id);
    const docResponse = await getDoc(doc(db, `stations/${req.params.id}`));
    if (docResponse.exists()) {
        res.json(docResponse.data());
    } else {
        res.sendStatus(404);
    }
});
export default router;
