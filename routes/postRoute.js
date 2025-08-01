const express = require('express');
const router = express.Router();
const Data = require('../models/Data');
const { validateAuthHeader } = require('../config/auth');

router.post('/', async (req, res) => {
  const authHeader = req.headers['authorization'];

  if (!validateAuthHeader(authHeader)) {
    return res.status(401).json({ message: 'Unauthorized: Invalid credentials' });
  }

  try {
    const payload = req.body;

    if (!payload || typeof payload !== 'object') {
      return res.status(400).json({ message: 'Invalid JSON payload' });
    }

    const dataEntry = await Data.create({ payload });

    res.status(201).json({ message: 'Data saved to MySQL', id: dataEntry.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
