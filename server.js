// server.js
const express = require('express');
const cors = require('cors');
const serverless = require('serverless-http');
const path = require('path');
const { initializeApp } = require('firebase/app');
const { getFirestore, doc, getDoc } = require('firebase/firestore');

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Firebase config from environment variables
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || "AIzaSyAA0G63crNGl78SjLnSWIqWTqARNhAoMKI",
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || "instatool-e71ab.firebaseapp.com",
  projectId: process.env.FIREBASE_PROJECT_ID || "instatool-e71ab",
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "instatool-e71ab.firebasestorage.app",
  messagingSenderId: process.env.FIREBASE_MSG_SENDER || "323942632136",
  appId: process.env.FIREBASE_APP_ID || "1:323942632136:web:7bdb4c6f2e94183a67b3fd",
  measurementId: process.env.FIREBASE_MEASUREMENT_ID || "G-PS9L97SSQC"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

// ✅ Firebase config API route
app.get('/api/firebase-config', (req, res) => {
  res.json(firebaseConfig);
});

// ✅ Code search API route
app.get('/api/code/:code', async (req, res) => {
  try {
    const code = req.params.code;
    const docRef = doc(db, 'codes', code);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      res.json({ 
        success: true, 
        data: docSnap.data() 
      });
    } else {
      res.json({ 
        success: false, 
        message: 'Code not found' 
      });
    }
  } catch (err) {
    console.error('Firestore error:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Error retrieving data from database' 
    });
  }
});

// ✅ Serve static files
app.use(express.static('public'));

// ✅ Root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ✅ Vercel export
module.exports = app;
module.exports.handler = serverless(app);
