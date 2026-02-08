const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  member: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  transactionId: {
    type: String,
    unique: true
  },
  paymentMethod: {
    type: String,
    enum: ['qr', 'card', 'bank'],
    default: 'qr'
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  qrCode: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Donation', donationSchema);