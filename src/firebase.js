import firebase from "firebase";
const firebaseApp = firebase.initializeApp({
    // config stuff
    apiKey: "<YOUR APIKEY>"
    authDomain: "instagram-clone-person.firebaseapp.com",
    projectId: "instagram-clone-person",
    storageBucket: "instagram-clone-person.appspot.com",
    messagingSenderId: "530541577265",
    appId: "<YOUR APPID>",
    measurementId: "<YOUR MEASUREMENTID>"
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();
export /*default*/ { db, auth, storage };