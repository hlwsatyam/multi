const express = require('express');
const router = express.Router();
const donationController = require('../controllers/donationController');
const { auth, isAdmin } = require('../middleware/auth');

// Member routes
router.post('/donate', auth, donationController.createDonation);
router.get('/member', auth, donationController.getMemberDonations);

// Admin routes
router.get('/', auth, isAdmin, donationController.getAllDonations);
router.get('/stats', auth, isAdmin, donationController.getDonationStats);
router.put('/:donationId/status', auth, isAdmin, donationController.updateDonationStatus);

module.exports = router;