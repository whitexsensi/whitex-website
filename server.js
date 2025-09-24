// server.js
const express = require('express');
const cors = require('cors');
const serverless = require('serverless-http');
const path = require('path');
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore');

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Firebase config from environment variables
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

// ======= API Route Example =======
// Fetch all documents from a Firestore collection
app.get('/api/data', async (req, res) => {
  try {
    const snapshot = await getDocs(collection(db, 'your-collection-name')); // replace with your collection
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json({ success: true, data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error retrieving data' });
  }
});

// ======= Serve frontend =======
app.use(express.static(path.join(__dirname, 'public')));

// Default route = frontend index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ======= Export for Vercel =======
module.exports = app;
module.exports.handler = serverless(app);
