const express = require('express');
const {
  getCampaigns,
  getFeaturedCampaigns,
  getCampaign,
  createCampaign,
  updateCampaign,
  deleteCampaign
} = require('../controllers/campaignController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { upload } = require('../middleware/uploadMiddleware');

const router = express.Router();

router.route('/featured').get(getFeaturedCampaigns);

router
  .route('/')
  .get(getCampaigns)
  .post(protect, authorize('admin', 'superadmin'), upload.single('coverImage'), createCampaign);

router
  .route('/:slug')
  .get(getCampaign);

router
  .route('/:id')
  .put(protect, authorize('admin', 'superadmin'), upload.single('coverImage'), updateCampaign)
  .delete(protect, authorize('admin', 'superadmin'), deleteCampaign);

module.exports = router;
