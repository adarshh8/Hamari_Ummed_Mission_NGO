const express = require('express');
const { subscribe, unsubscribe, getSubscribers } = require('../controllers/newsletterController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/subscribe', subscribe);
router.post('/unsubscribe', unsubscribe);
router.get('/subscribers', protect, authorize('admin', 'superadmin'), getSubscribers);

module.exports = router;
