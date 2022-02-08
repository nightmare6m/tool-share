const firebase = require("firebase");
const admin = require('firebase-admin');
const serviceAccount = require("../../gcp-key.json");

// Required for side-effects
require("firebase/firestore");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://tool-share.firebaseio.com',
         apiKey: process.env.FIREBASE_API_KEY,
     authDomain: process.env.FIREBASE_AUTH_DOMAIN,
     projectId: process.env.FIREBASE_PROJECT_ID
  });
  
  firebase.initializeApp({
     apiKey: process.env.FIREBASE_API_KEY,
     authDomain: process.env.FIREBASE_AUTH_DOMAIN,
     projectId: process.env.FIREBASE_PROJECT_ID
   });

   module.exports = {
       firebase,
       admin
   }