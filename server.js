const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Serve static files from the 'website' folder
app.use(express.static(path.join(__dirname, 'website')));

// Parse JSON bodies
app.use(express.json());

// Firebase config API for frontend
app.get('/api/firebase-config', (req, res) => {
  res.json({
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MSG_SENDER,
    appId: process.env.FIREBASE_APP_ID,
    measurementId: process.env.FIREBASE_MEASUREMENT_ID
  });
});

// Example API route to save data (adjust according to your Firestore logic)
app.post('/api/save-link', (req, res) => {
  const { name, link, password } = req.body;

  // Yahan Firestore save logic lagega
  // For now, just return success
  res.json({ success: true, message: 'Link received', data: { name, link, password } });
});

// Serve dashboard if needed
app.use('/dashboard', express.static(path.join(__dirname, 'dashboard/public')));

// Fallback to index.html for SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'website/index.html'));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
