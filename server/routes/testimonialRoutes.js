const express = require('express');
const { getTestimonials, getAdminTestimonials, createTestimonial, updateTestimonial, deleteTestimonial } = require('../controllers/testimonialController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .get(getTestimonials)
  .post(createTestimonial);

router.route('/admin')
  .get(protect, authorize('admin', 'superadmin'), getAdminTestimonials);

router.route('/:id')
  .put(protect, authorize('admin', 'superadmin'), updateTestimonial)
  .delete(protect, authorize('admin', 'superadmin'), deleteTestimonial);

module.exports = router;
