import express from 'express';
import { Newsletter } from '../models/db.js';

const router = express.Router();
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// POST /api/newsletter/subscribe
router.post('/subscribe', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || typeof email !== 'string' || !emailRegex.test(email.trim())) {
      return res.status(400).json({ error: 'A valid email address is required' });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check if email already exists
    const existing = await Newsletter.findOne({ email: normalizedEmail });
    if (existing) {
      // Must return exact message as specified
      return res.status(400).json({ error: 'You are already subscribed' });
    }

    const newSubscription = await Newsletter.create({
      email: normalizedEmail,
      subscribedAt: new Date().toISOString(),
    });

    return res.status(201).json({
      success: true,
      message: 'Thank you for subscribing to our newsletter!',
      subscription: newSubscription,
    });
  } catch (err) {
    console.error('Newsletter subscribe error:', err);
    return res.status(500).json({ error: 'Internal server error while subscribing' });
  }
});

export default router;
