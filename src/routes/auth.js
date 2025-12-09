// src/routes/auth.js
const express = require('express');
const {
  register,
  verifyByCode,
  verifyByToken,
} = require('../controllers/authController');

const router = express.Router();

router.post('/register', register);
router.post('/verify/code', verifyByCode);
router.post('/verify/token', verifyByToken);

// Export the router
module.exports = router;
