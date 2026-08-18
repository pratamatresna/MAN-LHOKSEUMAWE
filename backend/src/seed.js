require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const connectDB = require('./config/db');

const seedUsers = async () => {
  try {
    await connectDB();
    await User.deleteMany();

    const users = [
      { username: 'Admin', role: 'Admin', password: process.env.ROLE_ADMIN_PASS || 'admin123' },
      { username: 'Humas', role: 'Humas', password: process.env.ROLE_HUMAS_PASS || 'adminman' },
      { username: 'OSIM', role: 'OSIM', password: process.env.ROLE_OSIM_PASS || 'osim12' }
    ];

    await User.insertMany(users);
    console.log('Users seeded successfully');
    process.exit();
  } catch (error) {
    console.error('Error seeding users:', error);
    process.exit(1);
  }
};

seedUsers();
