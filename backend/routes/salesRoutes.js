const express = require('express');
const router = express.Router();
const { upload } = require('../config/cloudinaryConfig'); // Middleware for file upload
const salesController = require('../controllers/salesController');

// Frontend yahan request bhejega: /api/sales/upload
// Humne 'processSalesMeeting' ko rename karke 'handleSalesUpload' kar diya hai
router.post('/upload', upload.single('audio'), salesController.handleSalesUpload);

module.exports = router;