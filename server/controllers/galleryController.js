const Gallery = require('../models/Gallery');
const asyncHandler = require('express-async-handler');

// @desc    Get all gallery images
// @route   GET /api/v1/gallery
// @access  Public
exports.getGallery = asyncHandler(async (req, res) => {
  let query = {};
  if (req.query.category) {
    query.category = req.query.category;
  }
  if (req.query.featured) {
    query.featured = req.query.featured === 'true';
  }
  const limitNum = parseInt(req.query.limit) || 200;
  const gallery = await Gallery.find(query).sort({ createdAt: -1 }).limit(limitNum).populate('event', 'title');
  res.status(200).json({ success: true, count: gallery.length, data: gallery });
});

// @desc    Upload image to gallery (via file upload)
// @route   POST /api/v1/gallery
// @access  Private/Admin
exports.uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('Please upload an image file');
  }

  req.body.imageUrl = req.file.path;
  req.body.uploadedBy = req.user.id;

  const galleryItem = await Gallery.create(req.body);
  res.status(201).json({ success: true, data: galleryItem });
});

// @desc    Add image to gallery via URL (no file upload)
// @route   POST /api/v1/gallery/url
// @access  Private/Admin
exports.addByUrl = asyncHandler(async (req, res) => {
  const { title, imageUrl, caption, category, location, event, featured } = req.body;

  if (!imageUrl) {
    res.status(400);
    throw new Error('Please provide an image URL');
  }
  if (!title) {
    res.status(400);
    throw new Error('Please provide a title');
  }
  if (!category) {
    res.status(400);
    throw new Error('Please specify a category');
  }

  const galleryItem = await Gallery.create({
    title,
    imageUrl,
    caption: caption || '',
    category,
    location: location || 'Orai',
    event: event || undefined,
    featured: featured || false,
    uploadedBy: req.user.id
  });

  res.status(201).json({ success: true, data: galleryItem });
});

// @desc    Update gallery item (caption, featured, etc.)
// @route   PUT /api/v1/gallery/:id
// @access  Private/Admin
exports.updateGalleryItem = asyncHandler(async (req, res) => {
  const galleryItem = await Gallery.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  if (!galleryItem) {
    res.status(404);
    throw new Error('Gallery item not found');
  }

  res.status(200).json({ success: true, data: galleryItem });
});

// @desc    Delete image
// @route   DELETE /api/v1/gallery/:id
// @access  Private/Admin
exports.deleteImage = asyncHandler(async (req, res) => {
  const galleryItem = await Gallery.findById(req.params.id);

  if (!galleryItem) {
    res.status(404);
    throw new Error('Image not found');
  }

  // NOTE: Optional - Delete from Cloudinary using their SDK here

  await galleryItem.deleteOne();

  res.status(200).json({ success: true, data: {} });
});
