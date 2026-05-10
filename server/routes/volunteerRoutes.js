const express = require('express');
const { createVolunteer, getVolunteers, updateVolunteerStatus, updateVolunteer, deleteVolunteer } = require('../controllers/volunteerController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .post(createVolunteer)
  .get(protect, authorize('admin', 'superadmin'), getVolunteers);

router.route('/:id')
  .put(protect, authorize('admin', 'superadmin'), updateVolunteer)
  .delete(protect, authorize('admin', 'superadmin'), deleteVolunteer);

router.route('/:id/status')
  .put(protect, authorize('admin', 'superadmin'), updateVolunteerStatus);

module.exports = router;
