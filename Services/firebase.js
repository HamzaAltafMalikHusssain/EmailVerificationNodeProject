// src/services/firebase.js
require('dotenv').config();
const admin = require('firebase-admin');

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const rawPrivateKey = process.env.FIREBASE_PRIVATE_KEY;

// Basic validation so errors are clearer
if (!projectId || !clientEmail || !rawPrivateKey) {
  console.error(
    'Missing Firebase env vars. Please check FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY in your .env'
  );
  // do not crash in production automatically — throw so you see it during dev
  throw new Error('Firebase credentials not found in environment');
}

// Replace escaped newlines with real newlines
const privateKey = rawPrivateKey.replace(/\\n/g, '\n');

admin.initializeApp({
  credential: admin.credential.cert({
    projectId,
    clientEmail,
    privateKey,
  }),
  projectId,
});

const db = admin.firestore();

module.exports = { admin, db };
