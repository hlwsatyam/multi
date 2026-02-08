const Enquiry = require('../models/Enquiry');
const User = require('../models/User');
const Card = require('../models/Card');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

// Create new enquiry
exports.createEnquiry = async (req, res) => {
  try {
    const { name, email, mobile, reason } = req.body;
    const profilePic = req.file ? req.file.filename : null;

    if (!profilePic) {
      return res.status(400).json({ message: 'Profile picture is required' });
    }

    const enquiry = new Enquiry({
      name,
      email,
      mobile,
      reason,
      profilePic
    });

    await enquiry.save();
    res.status(201).json({ message: 'Enquiry submitted successfully', enquiry });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all enquiries
exports.getAllEnquiries = async (req, res) => {
  try {
    const enquiries = await Enquiry.find().sort({ createdAt: -1 });
    res.json(enquiries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Generate credentials for enquiry
exports.generateCredentials = async (req, res) => {
  try {
    const { enquiryId } = req.params;
    const enquiry = await Enquiry.findById(enquiryId);

    if (!enquiry) {
      return res.status(404).json({ message: 'Enquiry not found' });
    }

    // Generate username and password
    const username = `LMT${Date.now().toString().slice(-6)}`;
    const password = crypto.randomBytes(4).toString('hex');

    // Create user
    const user = new User({
      username,
      email: enquiry.email,
      password,
      mobile: enquiry.mobile,
      profilePic: enquiry.profilePic,
      role: 'member',
      enquiryId: enquiry._id
    });

    await user.save();

    // Update enquiry
    enquiry.generatedCredentials = { username, password };
    enquiry.status = 'approved';
    await enquiry.save();

    // Generate card
    const cardNumber = `CARD${Date.now().toString().slice(-8)}`;
    const card = new Card({
      member: user._id,
      cardNumber,
      cardHolderName: enquiry.name,
      expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
      logo: enquiry.profilePic
    });

    await card.save();

    // Send email with credentials
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: enquiry.email,
      subject: 'Your Lifeline Multi Technology Account Credentials',
      html: `
        <h2>Welcome to Lifeline Multi Technology</h2>
        <p>Your account has been created successfully.</p>
        <p><strong>Username:</strong> ${username}</p>
        <p><strong>Password:</strong> ${password}</p>
        <p>Please login and change your password.</p>
      `
    };

    await transporter.sendMail(mailOptions);

    res.json({ 
      message: 'Credentials generated successfully', 
      credentials: { username, password },
      user,
      card 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};