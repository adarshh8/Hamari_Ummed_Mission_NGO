const express = require('express');
const { getGallery, uploadImage, addByUrl, updateGalleryItem, deleteImage } = require('../controllers/galleryController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { upload } = require('../middleware/uploadMiddleware');

const router = express.Router();

router.route('/')
  .get(getGallery)
  .post(protect, authorize('admin', 'superadmin'), upload.single('image'), uploadImage);

// URL-based upload (no file upload needed)
router.post('/url', protect, authorize('admin', 'superadmin'), addByUrl);

router.route('/:id')
  .put(protect, authorize('admin', 'superadmin'), updateGalleryItem)
  .delete(protect, authorize('admin', 'superadmin'), deleteImage);

module.exports = router;
