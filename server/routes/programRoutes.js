const express = require('express');
const { getPrograms, getFeaturedPrograms, getProgram, createProgram, updateProgram, deleteProgram } = require('../controllers/programController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .get(getPrograms)
  .post(protect, authorize('admin', 'superadmin'), createProgram);

router.route('/featured').get(getFeaturedPrograms);

router.route('/:slug').get(getProgram);

router.route('/:id')
  .put(protect, authorize('admin', 'superadmin'), updateProgram)
  .delete(protect, authorize('admin', 'superadmin'), deleteProgram);

module.exports = router;
