const express = require('express');
const { createMessage, getMessages, updateMessage, deleteMessage } = require('../controllers/contactController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .post(createMessage)
  .get(protect, authorize('admin', 'superadmin'), getMessages);

router.route('/:id')
  .put(protect, authorize('admin', 'superadmin'), updateMessage)
  .delete(protect, authorize('admin', 'superadmin'), deleteMessage);

module.exports = router;
