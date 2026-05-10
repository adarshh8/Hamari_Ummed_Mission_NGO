const express = require('express');
const { getEvents, getUpcomingEvents, getEvent, createEvent, updateEvent, deleteEvent } = require('../controllers/eventController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .get(getEvents)
  .post(protect, authorize('admin', 'superadmin'), createEvent);

// Must be before /:id to avoid 'upcoming' being matched as an ID
router.route('/upcoming').get(getUpcomingEvents);

// Single route handles both slug-based GET and ID-based PUT/DELETE
router.route('/:id')
  .get(getEvent)
  .put(protect, authorize('admin', 'superadmin'), updateEvent)
  .delete(protect, authorize('admin', 'superadmin'), deleteEvent);

module.exports = router;
