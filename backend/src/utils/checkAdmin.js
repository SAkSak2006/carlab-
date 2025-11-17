require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkAdmin() {
  try {
    console.log('🔍 Checking database connection...');

    // Test database connection
    await prisma.$connect();
    console.log('✅ Database connected successfully');

    // Check for admin user
    console.log('\n🔍 Looking for admin users...');
    const adminUsers = await prisma.user.findMany({
      where: { role: 'admin' }
    });

    if (adminUsers.length === 0) {
      console.log('❌ No admin users found in database!');
      console.log('💡 Run "npm run seed" to create the admin user');
    } else {
      console.log(`✅ Found ${adminUsers.length} admin user(s):`);
      adminUsers.forEach(admin => {
        console.log(`   📧 Email: ${admin.email}`);
        console.log(`   👤 Name: ${admin.fullName}`);
        console.log(`   🆔 ID: ${admin.id}`);
        console.log('');
      });
    }

    // Count all users
    const totalUsers = await prisma.user.count();
    console.log(`📊 Total users in database: ${totalUsers}`);

  } catch (error) {
    console.error('❌ Error checking database:', error.message);
    if (error.code === 'P1001') {
      console.error('💡 Cannot reach database. Check your DATABASE_URL environment variable.');
    } else if (error.code === 'P2021') {
      console.error('💡 Table "User" does not exist. Run migrations: npx prisma migrate deploy');
    }
  } finally {
    await prisma.$disconnect();
  }
}

checkAdmin();
