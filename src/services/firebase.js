// src/services/firebase.js
/**
 * Initialize Firebase Admin SDK from environment variables.
 *
 * Supports either:
 *  - A single FIREBASE_SERVICE_ACCOUNT_JSON env var containing the entire service account JSON
 *  - Or individual env vars (FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY, etc.)
 *
 * IMPORTANT:
 * If you put the private key into .env, the newlines must be encoded as \n
 * (example provided earlier). We convert those back into actual newlines here.
 */

const admin = require('firebase-admin');

function loadServiceAccount() {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    try {
      return JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
    } catch (err) {
      console.error('Failed to parse FIREBASE_SERVICE_ACCOUNT_JSON:', err.message);
      throw err;
    }
  }

  // Build object from individual env vars
  const privateKeyRaw = process.env.FIREBASE_PRIVATE_KEY || '';
  const privateKey = privateKeyRaw.includes('\\n')
    ? privateKeyRaw.replace(/\\n/g, '\n')
    : privateKeyRaw;

  const svc = {
    type: process.env.FIREBASE_TYPE || 'service_account',
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: privateKey,
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: process.env.FIREBASE_AUTH_URI,
    token_uri: process.env.FIREBASE_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_CERT_URL,
    client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL,
    universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN,
  };

  // Minimal validation
  if (!svc.project_id || !svc.client_email || !svc.private_key) {
    throw new Error('Firebase credentials missing in environment variables.');
  }
  return svc;
}

try {
  const serviceAccount = loadServiceAccount();
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: serviceAccount.project_id,
  });
  console.log('✅ Firebase admin initialized from environment variables');
} catch (err) {
  console.error('❌ Failed to initialize Firebase Admin SDK:', err.message);
  // rethrow so the app fails fast if credentials are invalid/missing
  throw err;
}

const db = admin.firestore();

module.exports = { admin, db };
