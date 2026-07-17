const jwt = require('jsonwebtoken');

// @desc    Admin login (credentials come from .env, not the database)
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const validEmail = email.trim().toLowerCase() === process.env.ADMIN_EMAIL.trim().toLowerCase();
    const validPassword = password === process.env.ADMIN_PASSWORD;

    if (!validEmail || !validPassword) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { role: 'admin', email: process.env.ADMIN_EMAIL },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    // httpOnly cookie so the token can't be read by JS in the browser (XSS-safe)
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token, // also returned in body so Postman/curl testing works without cookie support
      admin: { email: process.env.ADMIN_EMAIL },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Admin logout
// @route   POST /api/auth/logout
// @access  Public
const logout = (req, res) => {
  res.clearCookie('token');
  res.status(200).json({ success: true, message: 'Logged out successfully' });
};

// @desc    Check current session (used by the dashboard on page load)
// @route   GET /api/auth/me
// @access  Private
const getMe = (req, res) => {
  res.status(200).json({ success: true, admin: req.admin });
};

module.exports = { login, logout, getMe };
