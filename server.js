const express = require('express');
const cors = require('cors');
const serverless = require('serverless-http');
const path = require('path');

const { initializeApp } = require('firebase/app');
const { getFirestore } = require('firebase/firestore');

const app = express();
app.use(cors());
app.use(express.json());

// Firebase config from env
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MSG_SENDER,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

// Serve static frontend
app.use(express.static(path.join(__dirname, 'public')));

// Default route = frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

module.exports = app;
module.exports.handler = serverless(app);
