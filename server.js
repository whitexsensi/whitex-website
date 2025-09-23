const express = require('express');
const cors = require('cors');
const serverless = require('serverless-http');
const admin = require('firebase-admin');

const app = express();
app.use(cors());
app.use(express.json());

// Firebase initialization
try {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`
  });
} catch (err) {
  console.error('Firebase initialization error:', err.message);
}

const db = admin.firestore();

// Test route
app.get('/', (req, res) => {
  res.send('Hello from WHITEX!');
});

// Example route to fetch links
app.get('/links', async (req, res) => {
  try {
    const snapshot = await db.collection('links').get();
    const links = snapshot.docs.map(doc => doc.data());
    res.json(links);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Export serverless handler
module.exports.handler = serverless(app);
