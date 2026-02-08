const Donation = require('../models/Donation');
const User = require('../models/User');
const Card = require('../models/Card');
const qr = require('qr-image');

// Create donation
exports.createDonation = async (req, res) => {
  try {
    const { amount, paymentMethod } = req.body;
    
    // Generate transaction ID
    const transactionId = `TXN${Date.now()}${Math.random().toString(36).substr(2, 9)}`;

    // Generate QR code
    const qrData = JSON.stringify({
      transactionId,
      amount,
      memberId: req.user._id,
      timestamp: Date.now()
    });

    const qrCodeBuffer = qr.imageSync(qrData, { type: 'png' });
    const qrCodeBase64 = qrCodeBuffer.toString('base64');

    const donation = new Donation({
      member: req.user._id,
      amount,
      transactionId,
      paymentMethod,
      qrCode: qrCodeBase64,
      status: 'pending'
    });

    await donation.save();

    // Update user's card with donation reference
    await Card.findOneAndUpdate(
      { member: req.user._id },
      { $push: { donations: donation._id } }
    );

    res.status(201).json({
      message: 'Donation initiated',
      donation: {
        _id: donation._id,
        amount: donation.amount,
        transactionId: donation.transactionId,
        qrCode: donation.qrCode,
        status: donation.status
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all donations (admin)
exports.getAllDonations = async (req, res) => {
  try {
    const donations = await Donation.find()
      .populate('member', 'username email')
      .sort({ createdAt: -1 });
    
    res.json(donations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get member donations
exports.getMemberDonations = async (req, res) => {
  try {
    const donations = await Donation.find({ member: req.user._id })
      .sort({ createdAt: -1 });

    const totalDonations = donations.reduce((sum, donation) => {
      return donation.status === 'completed' ? sum + donation.amount : sum;
    }, 0);

    const donationCount = donations.filter(d => d.status === 'completed').length;
    const lastDonation = donations.find(d => d.status === 'completed') || null;

    res.json({
      donations,
      totalDonations,
      donationCount,
      lastDonation
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update donation status
exports.updateDonationStatus = async (req, res) => {
  try {
    const { donationId } = req.params;
    const { status } = req.body;

    const donation = await Donation.findByIdAndUpdate(
      donationId,
      { status },
      { new: true }
    );

    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }

    res.json({
      message: 'Donation status updated',
      donation
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get donation statistics
exports.getDonationStats = async (req, res) => {
  try {
    const totalDonations = await Donation.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const monthlyStats = await Donation.aggregate([
      { $match: { status: 'completed' } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } }
    ]);

    const topDonors = await Donation.aggregate([
      { $match: { status: 'completed' } },
      {
        $group: {
          _id: '$member',
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { total: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' }
    ]);

    res.json({
      totalAmount: totalDonations[0]?.total || 0,
      monthlyStats,
      topDonors
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};