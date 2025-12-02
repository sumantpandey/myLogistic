const express = require('express');
const router = express.Router();
const { getStats, getUsers } = require('../controllers/adminController');
const auth = require('../middleware/auth');

// Admin dashboard stats
router.get('/stats', auth, getStats);
// List all users
router.get('/users', auth, getUsers);

module.exports = router;
