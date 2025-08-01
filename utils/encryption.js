const crypto = require('crypto');

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12; // GCM standard IV length
const KEY = crypto.createHash('sha256').update(process.env.ENCRYPTION_KEY).digest(); // 32 bytes

function encryptGCM(data) {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);

  const encrypted = Buffer.concat([
    cipher.update(JSON.stringify(data), 'utf8'),
    cipher.final()
  ]);
  const authTag = cipher.getAuthTag();

  return {
    iv: iv.toString('hex'),
    authTag: authTag.toString('hex'),
    content: encrypted.toString('hex')
  };
}

function decryptGCM(encrypted) {
  const iv = Buffer.from(encrypted.iv, 'hex');
  const authTag = Buffer.from(encrypted.authTag, 'hex');
  const content = Buffer.from(encrypted.content, 'hex');

  const decipher = crypto.createDecipheriv(ALGORITHM, KEY, iv);
  decipher.setAuthTag(authTag);

  const decrypted = Buffer.concat([
    decipher.update(content),
    decipher.final()
  ]);

  return JSON.parse(decrypted.toString('utf8'));
}

module.exports = { encryptGCM, decryptGCM };
