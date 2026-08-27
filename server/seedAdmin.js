require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const email = process.env.ADMIN_EMAIL || 'admin@humariumeed.org';
    const existingAdmin = await User.findOne({ email });
    
    if (existingAdmin) {
      console.log('Admin user already exists with email:', email);
      existingAdmin.password = 'password123';
      await existingAdmin.save();
      console.log('Password reset to: password123');
      process.exit();
    }

    const adminUser = await User.create({
      name: 'Super Admin',
      email: email,
      password: 'password123',
      role: 'superadmin'
    });

    console.log('Admin user created successfully:');
    console.log('Email:', adminUser.email);
    console.log('Password: password123');
    process.exit();
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin();
