const express = require('express');
const router = express.Router();
const Data = require('../models/Data');
const { validateAuthHeader } = require('../config/auth');
const { decryptGCM } = require('../utils/encryption');

router.post('/', async (req, res) => {
  const authHeader = req.headers['authorization'];

  if (!validateAuthHeader(authHeader)) {
    return res.status(401).json({ message: 'Unauthorized: Invalid credentials' });
  }

  try {
    const encryptedPayload = req.body;

    // Validate expected encrypted fields
    const { iv, authTag, content } = encryptedPayload;

    if (!iv || !authTag || !content) {
      return res.status(400).json({ message: 'Missing iv, authTag, or content in body' });
    }

    // Decrypt the payload sent from client
    const decryptedPayload = decryptGCM(encryptedPayload);

    // Store decrypted JSON in DB
    const dataEntry = await Data.create({ payload: decryptedPayload });

    res.status(201).json({
      message: 'Encrypted data received, decrypted, and saved to DB',
      id: dataEntry.id
    });

  } catch (err) {
    console.error('Decryption or DB error:', err);
    res.status(500).json({ message: 'Server error during decryption or saving' });
  }
});

module.exports = router;
