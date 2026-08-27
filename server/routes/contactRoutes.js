const express = require('express');
const { createMessage, getMessages, updateMessage, deleteMessage, replyMessage } = require('../controllers/contactController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .post(createMessage)
  .get(protect, authorize('admin', 'superadmin'), getMessages);

router.route('/:id')
  .put(protect, authorize('admin', 'superadmin'), updateMessage)
  .delete(protect, authorize('admin', 'superadmin'), deleteMessage);

router.route('/:id/reply')
  .post(protect, authorize('admin', 'superadmin'), replyMessage);

module.exports = router;
