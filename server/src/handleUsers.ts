// (/users)
import express, { Request } from 'express';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { AirGnGUser } from './index.d';
import { getFromCol } from './utils/GlobalFunctions';

const router = express.Router();

router.use((req, res, next) => {
    // console.log('Time: ', Date.now());
    next();
});

router.get('/', async (req, res) => {
    // tslint:disable-next-line:no-console
    console.log('got request for users');
    let users: AirGnGUser[];
    await getFromCol('users', (map) => {
        users = map;
    });
    res.json(users);
});
router.get('/:id', async (req: Request<{ id: string }>, res) => {
    // tslint:disable-next-line:no-console
    console.log('got request for user:' + req.params.id);
    const docResponse = await getDoc(doc(db, `users/${req.params.id}`));
    if (docResponse.exists()) {
        res.json(docResponse.data());
    } else {
        res.sendStatus(404);
    }
});

export default router;
