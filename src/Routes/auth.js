// src/routes/auth.js
const express = require('express');
const router = express.Router();
const {
  register,
  verifyByCode,
  verifyByToken,
} = require('../controllers/authController');

// POST /api/auth/register
router.post('/register', register);

// POST /api/auth/verify/code
router.post('/verify/code', verifyByCode);

// POST /api/auth/verify/token
router.post('/verify/token', verifyByToken);

module.exports = router;
