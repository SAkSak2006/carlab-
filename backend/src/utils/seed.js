require('dotenv').config();
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seed() {
  try {
    console.log('🌱 Starting database seed...');

    // Check if admin already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: 'admin@ilialox.com' }
    });

    if (existingAdmin) {
      console.log('⚠️  Admin user already exists, skipping seed');
      return;
    }

    // Hash password
    const passwordHash = await bcrypt.hash('admin123', 10);

    // Create admin user
    const admin = await prisma.user.create({
      data: {
        email: 'admin@ilialox.com',
        passwordHash: passwordHash,
        fullName: 'Администратор',
        role: 'admin'
      }
    });

    console.log('✅ Admin user created successfully');
    console.log('📧 Email:', admin.email);
    console.log('🔑 Password: admin123');
    console.log('⚠️  Remember to change the password after first login!');

    // Optionally create sample data
    console.log('\n🌱 Creating sample data...');

    // Create sample client
    const client = await prisma.client.create({
      data: {
        firstName: 'Иван',
        lastName: 'Петров',
        phone: '+7 (999) 123-45-67',
        email: 'ivan.petrov@example.com'
      }
    });

    // Create sample vehicle
    const vehicle = await prisma.vehicle.create({
      data: {
        clientId: client.id,
        brand: 'Toyota',
        model: 'Camry',
        year: 2020,
        licensePlate: 'А123БВ777'
      }
    });

    // Create sample request
    const request = await prisma.serviceRequest.create({
      data: {
        requestNumber: '100001',
        trackingToken: 'sample-tracking-token-12345678',
        clientId: client.id,
        vehicleId: vehicle.id,
        description: 'Требуется замена масла и диагностика двигателя',
        status: 'new',
        progressPercentage: 0,
        totalAmount: 0,
        paymentStatus: 'unpaid'
      }
    });

    console.log('✅ Sample request created:', request.requestNumber);
    console.log('🔗 Tracking token:', request.trackingToken);

    console.log('\n✅ Database seeded successfully!');

  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
