const express = require('express');
const router = express.Router();
const { importProducts, exportProducts, upload } = require('../controllers/fileController');
const { protect, authorize } = require('../middleware/auth');

router.post('/import-products', protect, authorize('vendor'), upload.single('file'), importProducts);
router.get('/export-products', protect, authorize('vendor'), exportProducts);

module.exports = router;