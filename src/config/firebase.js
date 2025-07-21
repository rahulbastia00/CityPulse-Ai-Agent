const admin = require("firebase-admin");
const serviceAccount = require("../../keys/firestore.json"); 
require("dotenv").config();

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount), 
        databaseURL: "https://pulsecity-465916-default-rtdb.firebaseio.com" 
    });
}


const db = admin.firestore();
module.exports = db;
