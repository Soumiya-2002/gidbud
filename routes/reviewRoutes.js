const express = require('express');
const { submitReview, getUserReviews } = require('../controllers/reviewController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/review/:userId', authMiddleware, submitReview);
router.get('/reviews/:userId', authMiddleware, getUserReviews);

module.exports = router;
