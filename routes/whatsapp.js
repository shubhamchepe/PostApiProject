const express = require('express');
const router = express.Router();
const { validateAuthHeader } = require('../config/auth');
const Message = require('../models/Message');
const twilio = require('twilio');
require('dotenv').config();

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

router.post('/send', async (req, res) => {
  const authHeader = req.headers['authorization'];
  if (!validateAuthHeader(authHeader)) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { to, contentSid, contentVariables } = req.body;

  if (!to || !contentSid || !contentVariables) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const response = await client.messages.create({
      from: `whatsapp:${process.env.TWILIO_WHATSAPP_FROM}`,
      to: `whatsapp:${to}`,
      contentSid: contentSid,
      contentVariables: JSON.stringify(contentVariables)
    });

    // Save to DB
    await Message.create({
      phone_number: to,
      direction: 'sent',
      message: `TEMPLATE - SID: ${contentSid}, VARS: ${JSON.stringify(contentVariables)}`,
      twilio_sid: response.sid
    });

    res.status(200).json({ message: 'WhatsApp message sent using template', sid: response.sid });
  } catch (error) {
    console.error('Twilio Send Error:', error);
    res.status(500).json({ message: 'Failed to send template message' });
  }
});

module.exports = router;
