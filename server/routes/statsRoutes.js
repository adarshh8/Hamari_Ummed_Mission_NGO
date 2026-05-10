const express = require('express');
const { getStats } = require('../controllers/statsController');

const router = express.Router();

router.route('/').get(getStats);

module.exports = router;
