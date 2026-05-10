const express = require('express');
const { getActivities, getActivity, createActivity, updateActivity, deleteActivity } = require('../controllers/activityController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .get(getActivities)
  .post(protect, authorize('admin', 'superadmin'), createActivity);

router.route('/:slug').get(getActivity);

router.route('/:id')
  .put(protect, authorize('admin', 'superadmin'), updateActivity)
  .delete(protect, authorize('admin', 'superadmin'), deleteActivity);

module.exports = router;
