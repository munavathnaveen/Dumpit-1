const express = require('express');
const router = express.Router();
const { searchOrders, searchShops, searchProducts, searchCategories } = require('../controllers/searchController');
const { protect } = require('../middleware/auth');

router.get('/orders', protect, searchOrders);
router.get('/shops', searchShops);
router.get('/products', searchProducts);
router.get('/categories', searchCategories);

module.exports = router;