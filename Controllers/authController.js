// src/controllers/authController.js
const { db } = require('../services/firebase');
const { hashPassword } = require('../utils/hash');
const { genCode, genToken } = require('../utils/codeGen');
const { sendVerificationEmail } = require('../services/emailService');

async function register(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: 'email & password required' });

    const usersRef = db.collection('users');
    const q = await usersRef.where('email', '==', email).limit(1).get();
    if (!q.empty) return res.status(409).json({ error: 'email_exists' });

    const passwordHash = await hashPassword(password);
    const userRef = usersRef.doc();
    await userRef.set({
      email,
      passwordHash,
      isVerified: false,
      createdAt: Date.now(),
    });

    const code = genCode();
    const token = genToken();
    const verRef = db.collection('email_verifications').doc();
    const expiresAt = Date.now() + 1000 * 60 * 15; // 15 min

    await verRef.set({
      userId: userRef.id,
      code,
      token,
      expiresAt,
      used: false,
      attempts: 0,
      createdAt: Date.now(),
    });

    await sendVerificationEmail(email, { code, token }).catch((err) => {
      console.error('email send failed', err);
    });

    return res.status(201).json({ message: 'verification_sent' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'server_error' });
  }
}

async function verifyByCode(req, res) {
  try {
    const { email, code } = req.body;
    if (!email || !code)
      return res.status(400).json({ error: 'email & code required' });

    const usersRef = db.collection('users');
    const uSnap = await usersRef.where('email', '==', email).limit(1).get();
    if (uSnap.empty) return res.status(404).json({ error: 'user_not_found' });
    const userDoc = uSnap.docs[0];

    const verQ = await db
      .collection('email_verifications')
      .where('userId', '==', userDoc.id)
      .where('used', '==', false)
      .orderBy('createdAt', 'desc')
      .limit(1)
      .get();

    if (verQ.empty)
      return res.status(410).json({ error: 'no_active_verification' });
    const verDoc = verQ.docs[0];
    const v = verDoc.data();

    if (Date.now() > v.expiresAt)
      return res.status(410).json({ error: 'expired' });
    if (v.attempts >= 5)
      return res.status(429).json({ error: 'too_many_attempts' });

    if (v.code !== code) {
      await verDoc.ref.update({ attempts: (v.attempts || 0) + 1 });
      return res.status(400).json({ error: 'invalid_code' });
    }

    await verDoc.ref.update({ used: true });
    await userDoc.ref.update({ isVerified: true, verifiedAt: Date.now() });
    return res.json({ message: 'verified' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'server_error' });
  }
}

async function verifyByToken(req, res) {
  try {
    const token = req.query.token || req.body.token;
    if (!token) return res.status(400).json({ error: 'token_required' });

    const verQ = await db
      .collection('email_verifications')
      .where('token', '==', token)
      .where('used', '==', false)
      .limit(1)
      .get();

    if (verQ.empty)
      return res.status(410).json({ error: 'invalid_or_used_token' });
    const verDoc = verQ.docs[0];
    const v = verDoc.data();
    if (Date.now() > v.expiresAt)
      return res.status(410).json({ error: 'expired' });

    await verDoc.ref.update({ used: true });
    await db
      .collection('users')
      .doc(v.userId)
      .update({ isVerified: true, verifiedAt: Date.now() });
    return res.json({ message: 'verified' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'server_error' });
  }
}

module.exports = { register, verifyByCode, verifyByToken };
