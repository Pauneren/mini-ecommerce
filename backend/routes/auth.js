const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getDatabase } = require('../database');
const { requireAdmin } = require('../middleware/auth');

const router = express.Router();

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function signToken(admin) {
  return jwt.sign(
    { id: admin.id, email: admin.email, role: 'admin' },
    process.env.JWT_SECRET,
    { expiresIn: '8h' }
  );
}

// GET /api/auth/status — returns whether an admin account exists
router.get('/status', async (req, res) => {
  try {
    const db = await getDatabase();
    const admin = await db.get('SELECT id FROM admins LIMIT 1');
    res.json({ hasAdmin: !!admin });
  } catch (error) {
    console.error('Auth status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/auth/setup — first-time admin account creation (runs once)
router.post('/setup', async (req, res) => {
  try {
    const { email, password } = req.body;
    const db = await getDatabase();

    const existing = await db.get('SELECT id FROM admins LIMIT 1');
    if (existing) {
      return res.status(403).json({ error: 'Admin account already exists.' });
    }

    if (!email || !isValidEmail(email)) {
      return res.status(400).json({ error: 'A valid email is required.' });
    }

    if (!password || password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters.' });
    }

    const password_hash = await bcrypt.hash(password, 12);
    const result = await db.run(
      'INSERT INTO admins (email, password_hash) VALUES (?, ?)',
      email, password_hash
    );

    const admin = { id: result.lastID, email };
    const token = signToken(admin);

    res.status(201).json({ message: 'Admin account created.', token });
  } catch (error) {
    console.error('Setup error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ error: 'Server configuration error.' });
    }

    const db = await getDatabase();
    const admin = await db.get('SELECT * FROM admins WHERE email = ?', email);

    if (!admin) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const valid = await bcrypt.compare(password, admin.password_hash);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const token = signToken(admin);
    res.json({ message: 'Login successful.', token, admin: { email: admin.email, role: 'admin' } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/auth/verify
router.get('/verify', (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: 'No token provided.' });

    if (!process.env.JWT_SECRET) return res.status(500).json({ error: 'Server configuration error.' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ valid: true, admin: { email: decoded.email, role: decoded.role } });
  } catch (error) {
    if (error.name === 'TokenExpiredError') return res.status(401).json({ error: 'Token expired.' });
    if (error.name === 'JsonWebTokenError') return res.status(401).json({ error: 'Invalid token.' });
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/auth/me — update email and/or password (requires login)
router.put('/me', requireAdmin, async (req, res) => {
  try {
    const { current_password, new_email, new_password, confirm_new_password } = req.body;

    if (!current_password) {
      return res.status(400).json({ error: 'Current password is required to make changes.' });
    }

    if (!new_email && !new_password) {
      return res.status(400).json({ error: 'Provide a new email or new password to update.' });
    }

    const db = await getDatabase();
    const admin = await db.get('SELECT * FROM admins WHERE id = ?', req.user.id);
    if (!admin) return res.status(404).json({ error: 'Admin not found.' });

    const valid = await bcrypt.compare(current_password, admin.password_hash);
    if (!valid) return res.status(401).json({ error: 'Current password is incorrect.' });

    let updatedEmail = admin.email;
    let updatedHash = admin.password_hash;

    if (new_email) {
      if (!isValidEmail(new_email)) return res.status(400).json({ error: 'New email is not valid.' });
      updatedEmail = new_email;
    }

    if (new_password) {
      if (new_password.length < 8) {
        return res.status(400).json({ error: 'New password must be at least 8 characters.' });
      }
      if (new_password !== confirm_new_password) {
        return res.status(400).json({ error: 'New passwords do not match.' });
      }
      updatedHash = await bcrypt.hash(new_password, 12);
    }

    await db.run(
      "UPDATE admins SET email = ?, password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
      updatedEmail, updatedHash, admin.id
    );

    const updatedAdmin = { id: admin.id, email: updatedEmail };
    const token = signToken(updatedAdmin);

    res.json({ message: 'Credentials updated successfully.', token });
  } catch (error) {
    console.error('Update credentials error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
