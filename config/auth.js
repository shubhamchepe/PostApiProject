const crypto = require('crypto');
require('dotenv').config();

const USERNAME = process.env.AUTH_USERNAME;
const PASSWORD = process.env.AUTH_PASSWORD;

const validHash = crypto
  .createHash('sha256')
  .update(`${USERNAME}:${PASSWORD}`)
  .digest('hex');

function validateAuthHeader(authHeader) {
  if (!authHeader) return false;
  return authHeader.trim() === validHash;
}

module.exports = { validateAuthHeader };
