import express from 'express';
import { Contacts } from '../models/db.js';

const router = express.Router();

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

router.post('/', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ error: 'Name is required' });
    }
    if (!email || typeof email !== 'string' || !emailRegex.test(email.trim())) {
      return res.status(400).json({ error: 'A valid email address is required' });
    }
    if (!phone || typeof phone !== 'string' || !phone.trim()) {
      return res.status(400).json({ error: 'Phone number is required' });
    }
    if (!subject || typeof subject !== 'string' || !subject.trim()) {
      return res.status(400).json({ error: 'Subject is required' });
    }
    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const newContact = await Contacts.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      subject: subject.trim(),
      message: message.trim(),
      createdAt: new Date().toISOString(),
    });

    return res.status(201).json({
      success: true,
      message: 'Your message has been sent successfully!',
      contact: newContact,
    });
  } catch (err) {
    console.error('Contact error:', err);
    return res.status(500).json({ error: 'Internal server error while sending message' });
  }
});

export default router;
