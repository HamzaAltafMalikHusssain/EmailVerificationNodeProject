// src/utils/hash.js
const bcrypt = require('bcryptjs');
async function hashPassword(p) {
  return await bcrypt.hash(p, 10);
}
async function comparePassword(p, h) {
  return await bcrypt.compare(p, h);
}
module.exports = { hashPassword, comparePassword };

// src/utils/codeGen.js
const { v4: uuidv4 } = require('uuid');
function genCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}
function genToken() {
  return uuidv4();
}
module.exports = { genCode, genToken };
