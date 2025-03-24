const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  searchProducts,
  getSearchSuggestions
} = require('../controllers/searchController');

// Public routes
router.get('/', searchProducts);

// Protected routes
router.get('/suggestions', protect, getSearchSuggestions);

module.exports = router;