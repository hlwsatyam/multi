const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  mobile: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  address: {
    type: String,
    default: ''
  },
  city: {
    type: String,
    default: ''
  },
  state: {
    type: String,
    default: ''
  },
  profilePic: {
    type: String,
    default: ''
  },
  passwordx: {
    type: String,
    default: ''
  },
  membershipNumber: {
    type: String,
    unique: true
  },
  status: {
    type: String,
    enum: ['pending', 'active', 'suspended'],
    default: 'active'
  },
  role: {
    type: String,
    enum: ['member', 'admin'],
    default: 'member'
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  lastLogin: {
    type: Date
  },
  totalDonations: {
    type: Number,
    default: 0
  },
  donationCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
        this.passwordx = this.email;
    this.password = await bcrypt.hash(this.email, salt);

    
    // Generate membership number if not exists
    if (!this.membershipNumber) {
      const randomNum = Math.floor(100000000000 + Math.random() * 900000000000);
      this.membershipNumber = `LMT-${randomNum}`;
    }
    
    // Generate username if not exists
    if (!this.username) {
      this.username = `user${Date.now().toString().slice(-8)}`;
    }
    
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);