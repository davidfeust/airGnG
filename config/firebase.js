// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
// import {getAnalytics} from "firebase/analytics";
import Constants from 'expo-constants';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage, ref } from 'firebase/storage';
import {
    getFunctions,
    httpsCallable,
    connectFunctionsEmulator,
} from 'firebase/functions';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
const firebaseConfig = {
    apiKey: Constants.manifest.extra.apiKey,
    authDomain: Constants.manifest.extra.authDomain,
    projectId: Constants.manifest.extra.projectId,
    storageBucket: Constants.manifest.extra.storageBucket,
    messagingSenderId: Constants.manifest.extra.messagingSenderId,
    appId: Constants.manifest.extra.appId,
};

// // Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const auth = getAuth();
const db = getFirestore();
const storage = getStorage();
const functions = getFunctions();
connectFunctionsEmulator(functions, 'localhost', 4001);

const airGnGFunctions = {
    logHelloWorld: httpsCallable(functions, 'logHelloWorld'),
    helloWorld: httpsCallable(functions, 'helloWorld'),
    local: httpsCallable(functions, 'local'),
};

export { auth, db, storage, airGnGFunctions, app };
