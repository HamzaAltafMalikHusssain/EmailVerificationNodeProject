const { v4: uuidv4 } = require('uuid');

// Generate a random 6-digit verification code
function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Generate a unique token using UUID v4
function generateToken() {
  return uuidv4();
}

module.exports = { generateCode, generateToken };
