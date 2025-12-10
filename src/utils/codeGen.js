// src/utils/codeGen.js
const { v4: uuidv4 } = require('uuid');

function genCode() {
  // 6-digit numeric code as a string
  return String(Math.floor(100000 + Math.random() * 900000));
}

function genToken() {
  return uuidv4();
}

module.exports = { genCode, genToken };
