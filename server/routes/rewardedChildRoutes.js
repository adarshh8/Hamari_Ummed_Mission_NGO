const express = require('express');
const { getRewardedChildren, getRewardedChildrenByYear, createRewardedChild, updateRewardedChild, deleteRewardedChild } = require('../controllers/rewardedChildController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .get(getRewardedChildren)
  .post(protect, authorize('admin', 'superadmin'), createRewardedChild);

router.route('/year/:year').get(getRewardedChildrenByYear);

router.route('/:id')
  .put(protect, authorize('admin', 'superadmin'), updateRewardedChild)
  .delete(protect, authorize('admin', 'superadmin'), deleteRewardedChild);

module.exports = router;
