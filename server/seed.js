const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env.local') });

const User = require('./models/User');
const Notification = require('./models/Notification');

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/smartdev';
    
    console.log('🌱 Connecting to MongoDB...');
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('🔄 Clearing existing data...');
    await User.deleteMany({});
    await Notification.deleteMany({});

    console.log('📝 Creating sample users...');
    const users = await User.create([
      {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123',
        phone: '+33612345678',
        company: 'Tech Corp',
        role: 'user'
      },
      {
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@smartdev.com',
        password: 'admin123',
        company: 'SmartDev',
        role: 'admin'
      },
      {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@example.com',
        password: 'password123',
        phone: '+33687654321',
        company: 'Design Studio',
        role: 'user'
      }
    ]);

    console.log(`✅ Created ${users.length} users`);

    // Create sample notifications for the first user
    console.log('🔔 Creating sample notifications...');
    const notifications = await Notification.create([
      {
        userId: users[0]._id,
        type: 'booking',
        title: 'Booking Confirmed',
        message: 'Your web development booking has been confirmed',
        icon: 'check-circle',
        color: 'success',
        isRead: false
      },
      {
        userId: users[0]._id,
        type: 'consultation',
        title: 'Consultation Available',
        message: 'A consultant is ready to discuss your project',
        icon: 'calendar',
        color: 'info',
        isRead: false
      },
      {
        userId: users[0]._id,
        type: 'promotion',
        title: 'Special Offer',
        message: '20% discount on AI solutions for limited time',
        icon: 'gift',
        color: 'warning',
        isRead: true
      }
    ]);

    console.log(`✅ Created ${notifications.length} notifications`);

    console.log('✨ Database seeded successfully!');
    console.log('\n📋 Sample Credentials:');
    console.log('   Email: john@example.com');
    console.log('   Password: password123');
    console.log('\n   Admin Email: admin@smartdev.com');
    console.log('   Admin Password: admin123');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run seed if called directly
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;
