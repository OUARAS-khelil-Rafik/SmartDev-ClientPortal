const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

const User = require('./models/User');
const Booking = require('./models/Booking');
const Consultation = require('./models/Consultation');
const Notification = require('./models/Notification');
const Project = require('./models/Project');

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    
    if (!mongoUri) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }
    
    console.log('🌱 Connecting to MongoDB Atlas...');
    console.log('📍 URI:', mongoUri.replace(/:[^:]*@/, ':****@'));
    
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB successfully!');

    console.log('\n🔄 Clearing existing data...');
    await User.deleteMany({});
    await Booking.deleteMany({});
    await Consultation.deleteMany({});
    await Project.deleteMany({});
    await Notification.deleteMany({});
    console.log('✅ Existing data cleared');

    console.log('\n📝 Creating sample users...');
    const users = await User.create([
      {
        firstName: 'Admin',
        lastName: 'Novalis',
        email: 'admin@novalis-ai.dev',
        password: 'Novalis@2026',
        phone: '+213660496144',
        company: 'Novalis AI',
        role: 'admin'
      },
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
      },
      {
        firstName: 'Rafik',
        lastName: 'Ouaras',
        email: 'rafik@novalis-ai.com',
        password: 'Kiko12032003',
        phone: '+33612348765',
        company: 'Novalis AI',
        role: 'admin'
      }
      ,
      {
        firstName: 'Dev',
        lastName: 'One',
        email: 'dev1@smartdev.com',
        password: 'devpass123',
        phone: '+33600000001',
        company: 'Freelance',
        role: 'developer'
      },
      {
        firstName: 'Dev',
        lastName: 'Two',
        email: 'dev2@smartdev.com',
        password: 'devpass456',
        phone: '+33600000002',
        company: 'Freelance',
        role: 'developer'
      }
    ]);

    console.log(`✅ Created ${users.length} users`);

    console.log('\n📅 Creating sample bookings...');
    const bookings = await Booking.create([
      {
        userId: users[0]._id,
        serviceName: 'Web Development',
        title: 'E-commerce Platform Development',
        description: 'Need a modern e-commerce platform with payment integration and admin dashboard',
        budget: 15000,
        timeline: '2-4 weeks',
        preferredStartDate: new Date('2026-02-01'),
        status: 'confirmed'
      },
      {
        userId: users[2]._id,
        serviceName: 'Mobile App',
        title: 'iOS & Android Mobile App',
        description: 'Cross-platform mobile app for restaurant ordering system',
        budget: 25000,
        timeline: '1-3 months',
        preferredStartDate: new Date('2026-02-15'),
        status: 'in-progress'
      },
      {
        userId: users[0]._id,
        serviceName: 'AI Solution',
        title: 'AI Chatbot Integration',
        description: 'Integrate AI chatbot for customer support automation',
        budget: 8000,
        timeline: '1-2 weeks',
        preferredStartDate: new Date('2026-01-25'),
        status: 'pending'
      },
      {
        userId: users[3]._id,
        serviceName: 'Cloud Services',
        title: 'AWS Infrastructure Setup',
        description: 'Setup scalable cloud infrastructure on AWS with monitoring',
        budget: 12000,
        timeline: '2-4 weeks',
        preferredStartDate: new Date('2026-02-10'),
        status: 'confirmed'
      }
    ]);

    console.log(`✅ Created ${bookings.length} bookings`);

    console.log('\n🚧 Creating sample projects...');
    const projects = await Project.create([
      {
        userId: users[0]._id,
        title: 'E-commerce Revamp Project',
        description: 'Full redesign and migration to a modern headless stack',
        status: 'active',
        budget: 20000,
        timeline: '2-4 weeks',
        startDate: new Date('2026-02-01'),
        relatedBooking: bookings[0]._id,
        tags: ['ecommerce', 'frontend', 'payments']
      },
      {
        userId: users[2]._id,
        title: 'Mobile Ordering App',
        description: 'Native-feeling cross-platform app for restaurants',
        status: 'in-progress',
        budget: 25000,
        timeline: '1-3 months',
        startDate: new Date('2026-02-15'),
        relatedBooking: bookings[1]._id,
        tags: ['mobile', 'react-native']
      },
      {
        userId: users[3]._id,
        title: 'AI Analytics Pilot',
        description: 'Proof-of-concept for business intelligence dashboards',
        status: 'planned',
        budget: 50000,
        timeline: '3-6 months',
        tags: ['ai', 'analytics']
      }
    ]);

    console.log(`✅ Created ${projects.length} projects`);

    console.log('\n💬 Creating sample consultations...');
    const consultations = await Consultation.create([
      {
        userId: users[0]._id,
        email: 'john@example.com',
        name: 'John Doe',
        projectType: 'Web',
        description: 'Looking for a custom web solution for my business',
        budget: '$25k - $50k',
        timeline: '3-6 months',
        status: 'active',
        conversationHistory: [
          {
            role: 'user',
            message: 'Hello, I need help with a web development project',
            timestamp: new Date('2026-01-15')
          },
          {
            role: 'model',
            message: 'Hello! I would be happy to help. Can you tell me more about your project requirements?',
            timestamp: new Date('2026-01-15')
          }
        ]
      },
      {
        userId: users[2]._id,
        email: 'jane@example.com',
        name: 'Jane Smith',
        projectType: 'Mobile',
        description: 'Mobile app for my design portfolio',
        budget: '$5k - $25k',
        timeline: '1-3 months',
        status: 'completed'
      },
      {
        userId: users[3]._id,
        email: 'rafik@novalis-ai.com',
        name: 'Rafik Ouaras',
        projectType: 'AI',
        description: 'AI-powered analytics platform for business intelligence',
        budget: '$50k - $100k',
        timeline: '6+ months',
        status: 'active'
      }
    ]);

    console.log(`✅ Created ${consultations.length} consultations`);

    console.log('\n🔔 Creating sample notifications...');
    const notifications = await Notification.create([
      {
        userId: users[0]._id,
        type: 'booking',
        title: 'Booking Confirmed',
        message: 'Your web development booking has been confirmed',
        icon: 'check-circle',
        color: 'success',
        isRead: false,
        relatedId: bookings[0]._id,
        relatedModel: 'Booking'
      },
      {
        userId: users[0]._id,
        type: 'consultation',
        title: 'Consultation Available',
        message: 'A consultant is ready to discuss your project',
        icon: 'calendar',
        color: 'info',
        isRead: false,
        relatedId: consultations[0]._id,
        relatedModel: 'Consultation'
      },
      {
        userId: users[0]._id,
        type: 'promotion',
        title: 'Special Offer',
        message: '20% discount on AI solutions for limited time',
        icon: 'gift',
        color: 'warning',
        isRead: true
      },
      {
        userId: users[2]._id,
        type: 'booking',
        title: 'Project Started',
        message: 'Your mobile app development project has started',
        icon: 'play-circle',
        color: 'success',
        isRead: false,
        relatedId: bookings[1]._id,
        relatedModel: 'Booking'
      },
      {
        userId: users[3]._id,
        type: 'system',
        title: 'Welcome to Novalis AI',
        message: 'Welcome to the SmartDev platform! Your admin account is ready.',
        icon: 'star',
        color: 'info',
        isRead: false
      }
    ]);

    console.log(`✅ Created ${notifications.length} notifications`);

    console.log('\n✨ Database seeded successfully!');
    console.log('\n📊 Summary:');
    console.log(`   👥 Users: ${users.length}`);
    console.log(`   📅 Bookings: ${bookings.length}`);
    console.log(`   💬 Consultations: ${consultations.length}`);
    console.log(`   🔔 Notifications: ${notifications.length}`);
    console.log(`   🗂️ Projects: ${projects ? projects.length : 0}`);
    console.log('\n📋 Sample Credentials:');
    console.log('   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('   User Email: john@example.com');
    console.log('   Password: password123');
    console.log('   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('   Admin Email: admin@smartdev.com');
    console.log('   Admin Password: admin123');
    console.log('   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('   Your Admin: rafik@novalis-ai.com');
    console.log('   Password: Kiko12032003');
    console.log('   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('   Developer Email: dev1@smartdev.com');
      console.log('   Developer Password: devpass123');
      console.log('   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('   Developer Email: dev2@smartdev.com');
      console.log('   Developer Password: devpass456');
      console.log('   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n🌐 MongoDB Atlas Database: novalis-ai');
    console.log('🎉 All data is now stored in MongoDB!\n');

    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
};

seedDatabase();
