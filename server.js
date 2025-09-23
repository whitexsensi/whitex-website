const express = require('express');
const cors = require('cors');
const serverless = require('serverless-http');
const admin = require('firebase-admin');

// Firebase Admin SDK initialization
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`
});

const db = admin.firestore();

const app = express();
app.use(cors());
app.use(express.json());

// Example route
app.get('/', (req, res) => {
  res.send('Hello from WHITEX!');
});

// Example Firebase route
app.get('/links', async (req, res) => {
  try {
    const snapshot = await db.collection('links').get();
    const links = snapshot.docs.map(doc => doc.data());
    res.json(links);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports.handler = serverless(app);
