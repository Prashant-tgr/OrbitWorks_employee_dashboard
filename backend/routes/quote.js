import express from 'express';
import { Quotes } from '../models/db.js';

const router = express.Router();
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// POST /api/quote
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, serviceRequired, budget, message } = req.body;

    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ error: 'Name is required' });
    }
    if (!email || typeof email !== 'string' || !emailRegex.test(email.trim())) {
      return res.status(400).json({ error: 'A valid email address is required' });
    }
    if (!phone || typeof phone !== 'string' || !phone.trim()) {
      return res.status(400).json({ error: 'Phone number is required' });
    }
    if (!serviceRequired || typeof serviceRequired !== 'string' || !serviceRequired.trim()) {
      return res.status(400).json({ error: 'Please select a required service' });
    }
    if (!budget || typeof budget !== 'string' || !budget.trim()) {
      return res.status(400).json({ error: 'Please select a budget range' });
    }
    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ error: 'Project description/message is required' });
    }

    const newQuote = await Quotes.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      serviceRequired: serviceRequired.trim(),
      budget: budget.trim(),
      message: message.trim(),
      createdAt: new Date().toISOString(),
    });

    return res.status(201).json({
      success: true,
      message: 'Your quote request has been received! Our team will contact you within 24 hours.',
      quote: newQuote,
    });
  } catch (err) {
    console.error('Quote submission error:', err);
    return res.status(500).json({ error: 'Internal server error submitting quote request' });
  }
});

export default router;
