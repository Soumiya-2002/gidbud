const express = require('express');
const { register, login, logout, getProfile } = require('../controllers/userControllers');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/user/profile/:id', authMiddleware, getProfile);

module.exports = router;
