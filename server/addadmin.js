const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config(); // if you're using .env for DB connection

const User = require('./models/User'); // Adjust the path to your User model

const addAdmin = async () => {
  const username = 'admin2';
  const password = 'admin@123'; // your raw password
  const email = 'admin1234@example.com';

  try {
    await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

    const existing = await User.findOne({ username });
    if (existing) {
      console.log('Admin already exists.');
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const adminUser = new User({
      fullName: 'Admin User',
      email,
      username,
      password: hashedPassword,
      mobile:'7834311234',
      isVerified: true,
      role: 'admin'
    });

    await adminUser.save();
    console.log('Admin created successfully.');
    mongoose.disconnect();
  } catch (error) {
    console.error('Error creating admin:', error);
    mongoose.disconnect();
  }
};

addAdmin();
