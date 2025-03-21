const asyncHandler = require('express-async-handler');
const multer = require('multer');
const ExcelJS = require('exceljs');
const Product = require('../models/Product');
const Vendor = require('../models/Vendor');
const { validateFile } = require('../utils/fileValidator');
const fs = require('fs');
const path = require('path');

// Multer setup for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

// @desc    Import products from Excel/CSV
// @route   POST /api/files/import-products
// @access  Private (vendor)
// @example Usage: POST /api/files/import-products
//   FormData: 
//   - file: [Select your Excel/CSV file here]
//   This endpoint allows a vendor to upload a file (CSV/Excel) to import products into the system.
const importProducts = asyncHandler(async (req, res) => {
    const vendor = await Vendor.findOne({ user: req.user._id });
    if (!vendor) {
        res.status(404);
        throw new Error('Vendor not found');
    }

    const filePath = req.file.path;
    if (!validateFile(filePath)) {
        fs.unlinkSync(filePath); // Clean up invalid file
        res.status(400);
        throw new Error('Invalid file format. Only CSV/Excel allowed.');
    }

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);
    const worksheet = workbook.getWorksheet(1);

    const products = [];
    worksheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) return; // Skip header
        products.push({
            name: row.getCell(1).value,
            description: row.getCell(2).value,
            price: row.getCell(3).value,
            stock: row.getCell(4).value,
            category: row.getCell(5).value,
            vendor: vendor._id,
        });
    });

    await Product.insertMany(products);
    fs.unlinkSync(filePath); // Clean up file after processing

    res.status(201).json({ message: 'Products imported successfully', count: products.length });
});

// @desc    Export products to Excel
// @route   GET /api/files/export-products
// @access  Private (vendor)
// @example Usage: GET /api/files/export-products
//   This endpoint allows a vendor to download an Excel file containing all their products.
const exportProducts = asyncHandler(async (req, res) => {
    const vendor = await Vendor.findOne({ user: req.user._id });
    const products = await Product.find({ vendor: vendor._id });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Products');

    worksheet.columns = [
        { header: 'Name', key: 'name', width: 20 },
        { header: 'Description', key: 'description', width: 30 },
        { header: 'Price', key: 'price', width: 10 },
        { header: 'Stock', key: 'stock', width: 10 },
        { header: 'Category', key: 'category', width: 15 },
    ];

    products.forEach((product) => {
        worksheet.addRow({
            name: product.name,
            description: product.description,
            price: product.price,
            stock: product.stock,
            category: product.category,
        });
    });

    const filePath = path.join(__dirname, '../uploads', `products-${Date.now()}.xlsx`);
    await workbook.xlsx.writeFile(filePath);

    res.download(filePath, 'products.xlsx', (err) => {
        if (!err) fs.unlinkSync(filePath); // Clean up after download
    });
});

module.exports = { importProducts, exportProducts, upload };
