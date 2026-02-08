const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    // Check if admin exists
    const existingAdmin = await User.findOne({ email: 'admin@lifeline.com' });
    
    if (existingAdmin) {
      console.log('Admin user already exists');
      return;
    }

    const admin = new User({
      username: 'admin',
      email: 'admin@lifeline.com',
      password: 'Admin@123', // Change this in production
      mobile: '1234567890',
      role: 'admin'
    });

    await admin.save();
    console.log('Admin user created successfully');
    console.log('Username: admin');
    console.log('Password: Admin@123');

  } catch (error) {
    console.error('Error creating admin:', error);
  } finally {
    await mongoose.disconnect();
  }
};

createAdmin();