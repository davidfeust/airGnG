'use strict';

const functions = require('firebase-functions');

// The Firebase Admin SDK to access Firestore.
const admin = require('firebase-admin');
admin.initializeApp();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest((request, response) => {
    functions.logger.info('Hello logs!', { structuredData: true });
    response.send({ message: 'Hello from Firebase!' });
});
exports.logHelloWorld = functions.https.onCall(() => {
    functions.logger.info('Hello logs!', { structuredData: true });
});
exports.local = functions.https.onCall(() => ({ message: 'body message!' }));
