import cors from 'cors';
import express from 'express';
import handleStations from './handleStations';
import handleUsers from './handleUsers';
import handleOrders from './handleOrders';

const app = express();
app.use(cors());

const port = 8080; // default port to listen

// define a route handler for the default home page
app.get('/', (req, res) => {
    res.send('רביד יא חרא');
});

app.use('/stations', handleStations);
app.use('/users', handleUsers);
app.use('/orders', handleOrders);

// start the Express server
app.listen(port, () => {
    // tslint:disable-next-line:no-console
    console.log(`server started at http://localhost:${port}`);
});
