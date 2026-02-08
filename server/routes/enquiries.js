const express = require('express');
const router = express.Router();
const enquiryController = require('../controllers/enquiryController');
const { auth, isAdmin } = require('../middleware/auth');
const upload = require('../config/multer');

// Create enquiry (public)
router.post('/', upload.single('profilePic'), enquiryController.createEnquiry);

// Protected admin routes
router.get('/', auth, isAdmin, enquiryController.getAllEnquiries);
router.post('/:enquiryId/generate-credentials', auth, isAdmin, enquiryController.generateCredentials);

module.exports = router;