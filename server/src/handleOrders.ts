// (/orders)
import express, { Request } from 'express';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { getFromCol } from './utils/GlobalFunctions';
import { Order } from './index.d';
const router = express.Router();

router.use((req, res, next) => {
    // console.log('Time: ', Date.now());
    next();
});

router.get('/', async (req, res) => {
    // tslint:disable-next-line:no-console
    console.log('got request for orders');
    let orders: Order[];
    await getFromCol('orders', (map) => {
        orders = map;
    });
    res.json(orders);
});

router.get('/:id', async (req: Request<{ id: string }>, res) => {
    // tslint:disable-next-line:no-console
    console.log('got request for orders:' + req.params.id);
    const docResponse = await getDoc(doc(db, `orders/${req.params.id}`));
    if (docResponse.exists()) {
        res.json(docResponse.data());
    } else {
        res.sendStatus(404);
    }
});
export default router;
