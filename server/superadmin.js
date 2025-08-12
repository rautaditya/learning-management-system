const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('./models/User'); // adjust the path

mongoose.connect('mongodb://localhost:27017/lmsdb'); // replace with your DB

async function createSuperAdmin() {
  const hashedPassword = await bcrypt.hash('superadmin@123', 10);

  const superadmin = new User({
    fullName: 'Super Admin',
    email: 'superadmin12@example.com',
    username: 'superadmin',
    password: hashedPassword,
    role: 'superadmin',
    status: 'active',
    gender: 'male',
    dob: new Date('1990-01-01'),
    address: '123 Main St',
    joiningDate: new Date(),
    mobile: '1234567890',
    isVerified: true
  });

  await superadmin.save();
  console.log('Superadmin created');
  mongoose.disconnect();
}

createSuperAdmin();
