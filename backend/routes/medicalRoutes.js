const express = require('express');
const router = express.Router();
const { upload } = require('../config/cloudinaryConfig');
const medicalController = require('../controllers/medicalController');

router.post('/upload', upload.single('audio'), medicalController.handleMedicalUpload);

module.exports = router;