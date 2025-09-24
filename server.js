const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");

const app = express();
app.use(cors());
app.use(express.json());

// Firebase initialization
if (!admin.apps.length) {
  try {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`,
    });

    console.log("Firebase initialized");
  } catch (err) {
    console.error("Firebase initialization error:", err.message);
  }
}

const db = admin.firestore();

// Test route
app.get("/", (req, res) => {
  res.send("Hello from WHITEX running on Vercel!");
});

// Example route to fetch links
app.get("/api/links", async (req, res) => {
  try {
    const snapshot = await db.collection("links").get();
    const links = snapshot.docs.map((doc) => doc.data());
    res.json(links);
  } catch (err) {
    console.error("Error fetching links:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Export for Vercel
module.exports = app;
