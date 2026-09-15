import express from 'express';
import { Contacts, Users, Quotes, Newsletter } from '../models/db.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// All admin routes protected — return 401 if no valid admin token
router.use(authenticate);
router.use(requireAdmin);

// GET /api/admin/contacts - view all contact form submissions
router.get('/contacts', async (req, res) => {
  try {
    const contacts = await Contacts.find({}, { createdAt: -1 });
    return res.status(200).json({ success: true, count: contacts.length, contacts });
  } catch (err) {
    console.error('Admin contacts error:', err);
    return res.status(500).json({ error: 'Internal server error fetching contacts' });
  }
});

// DELETE /api/admin/contacts/:id - delete a submission
router.delete('/contacts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Contacts.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ error: 'Contact submission not found' });
    }
    return res.status(200).json({ success: true, message: 'Contact submission deleted successfully', deleted });
  } catch (err) {
    console.error('Admin delete contact error:', err);
    return res.status(500).json({ error: 'Internal server error deleting contact' });
  }
});

// GET /api/admin/users — view all registered users
router.get('/users', async (req, res) => {
  try {
    const users = await Users.find({}, { createdAt: -1 });
    // Omit hashed passwords from response
    const sanitizedUsers = users.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      createdAt: u.createdAt,
    }));
    return res.status(200).json({ success: true, count: sanitizedUsers.length, users: sanitizedUsers });
  } catch (err) {
    console.error('Admin users error:', err);
    return res.status(500).json({ error: 'Internal server error fetching users' });
  }
});

// GET /api/admin/quotes - view all quote requests
router.get('/quotes', async (req, res) => {
  try {
    const quotes = await Quotes.find({}, { createdAt: -1 });
    return res.status(200).json({ success: true, count: quotes.length, quotes });
  } catch (err) {
    console.error('Admin quotes error:', err);
    return res.status(500).json({ error: 'Internal server error fetching quotes' });
  }
});

// GET /api/admin/newsletters - view all newsletter subscribers
router.get('/newsletters', async (req, res) => {
  try {
    const newsletters = await Newsletter.find({}, { subscribedAt: -1 });
    return res.status(200).json({ success: true, count: newsletters.length, newsletters });
  } catch (err) {
    console.error('Admin newsletter error:', err);
    return res.status(500).json({ error: 'Internal server error fetching newsletter subscriptions' });
  }
});

export default router;
