const express = require('express');
const rateLimit = require('express-rate-limit');
const { chat } = require('../controllers/chatController');

const router = express.Router();

// This route is public (visitors don't log in to chat), and each request costs
// real API usage — rate-limit it more tightly than the login route.
const chatLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, message: 'Too many messages — please wait a bit before trying again.' },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/', chatLimiter, chat);

module.exports = router;
