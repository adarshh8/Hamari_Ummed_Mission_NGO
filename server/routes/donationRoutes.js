const express = require('express');
const { createDonation, verifyDonation, getDonations } = require('../controllers/donationController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', createDonation);
router.post('/verify', verifyDonation);

router.route('/')
  .get(protect, authorize('admin', 'superadmin'), getDonations);

module.exports = router;
