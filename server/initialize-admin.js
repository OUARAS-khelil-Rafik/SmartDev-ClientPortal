const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

const User = require('./models/User');

/**
 * Initialize admin user if database is empty
 * Useful for first-time setup
 */
const initializeDefaultAdmin = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    
    if (!mongoUri) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }
    
    console.log('🔐 Initializing default admin user...');
    
    // Check if any user exists
    const userCount = await User.countDocuments({});
    
    if (userCount === 0) {
      console.log('📝 Creating default admin user...');
      
      const adminUser = await User.create({
        firstName: 'Admin',
        lastName: 'Novalis',
        email: 'admin@novalis-ai.dev',
        password: 'Novalis@2026',
        company: 'Novalis AI',
        role: 'admin',
        isActive: true
      });
      
      console.log('✅ Default admin user created successfully!');
      console.log('');
      console.log('📋 Admin Credentials:');
      console.log('   Email: admin@novalis-ai.dev');
      console.log('   Password: Novalis@2026');
      console.log('   Role: admin');
      console.log('');
      
      return adminUser;
    } else {
      console.log('ℹ️  Database already has users. Skipping admin initialization.');
      
      // Check if admin exists
      const adminExists = await User.findOne({ 
        email: 'admin@novalis-ai.dev',
        role: 'admin'
      });
      
      if (adminExists) {
        console.log('✅ Default admin user already exists');
        return adminExists;
      } else {
        console.log('⚠️  Warning: Default admin user not found');
        console.log('   Email: admin@novalis-ai.dev');
        return null;
      }
    }
  } catch (error) {
    console.error('❌ Error initializing admin user:', error.message);
    throw error;
  }
};

/**
 * Standalone script to initialize admin
 * Run with: node initialize-admin.js
 */
if (require.main === module) {
  const mongoUri = process.env.MONGODB_URI;
  
  if (!mongoUri) {
    console.error('❌ MONGODB_URI is not defined');
    console.log('Please ensure .env.local is configured with MONGODB_URI');
    process.exit(1);
  }
  
  mongoose.connect(mongoUri)
    .then(async () => {
      console.log('✅ MongoDB connected');
      console.log('');
      
      await initializeDefaultAdmin();
      
      console.log('');
      console.log('🎉 Initialization complete!');
      console.log('');
      
      await mongoose.disconnect();
      console.log('✅ MongoDB disconnected');
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ Connection error:', error.message);
      process.exit(1);
    });
}

module.exports = { initializeDefaultAdmin };
