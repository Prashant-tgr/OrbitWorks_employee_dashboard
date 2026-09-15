import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { connectDB, Users, Contacts, Newsletter, Quotes, Employees } from './models/db.js';

dotenv.config();

async function seed() {
  console.log('[Seed] Initializing database connection...');
  await connectDB();

  console.log('[Seed] Checking admin user...');
  const adminEmail = 'admin@orbitworks.com';
  const existingAdmin = await Users.findOne({ email: adminEmail });

  const adminPasswordHash = await bcrypt.hash('AdminPassword123!', 10);

  if (!existingAdmin) {
    const admin = await Users.create({
      name: 'Orbit Administrator',
      email: adminEmail,
      password: adminPasswordHash,
      role: 'admin',
      createdAt: new Date().toISOString(),
    });
    console.log(`[Seed] Created admin account: ${admin.email}`);
  } else {
    console.log(`[Seed] Admin account already exists: ${existingAdmin.email}`);
  }

  // Also create a demo regular user
  const userEmail = 'employee@orbitworks.com';
  const existingUser = await Users.findOne({ email: userEmail });
  if (!existingUser) {
    const userPasswordHash = await bcrypt.hash('Employee123!', 10);
    await Users.create({
      name: 'Elena Rostova',
      email: userEmail,
      password: userPasswordHash,
      role: 'user',
      createdAt: new Date().toISOString(),
    });
    console.log(`[Seed] Created demo user account: ${userEmail}`);
  }

  // Seed sample contacts if empty
  const contactCount = await Contacts.countDocuments();
  if (contactCount === 0) {
    console.log('[Seed] Seeding sample contact submissions...');
    await Contacts.create({
      name: 'Sarah Connor',
      email: 'sarah.connor@skytech.io',
      phone: '+1 (555) 234-5678',
      subject: 'Enterprise Integration Inquiry',
      message: 'Hello, our team wants to learn more about deploying Orbit AI across 250 engineers.',
      createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    });
    await Contacts.create({
      name: 'David Miller',
      email: 'dmiller@prismacorp.com',
      phone: '+1 (555) 987-6543',
      subject: 'Security & Compliance question',
      message: 'Can you provide documentation regarding SOC2 Type II and GDPR data retention policies?',
      createdAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
    });
    console.log('[Seed] Sample contacts created.');
  }

  // Seed sample quotes if empty
  const quoteCount = await Quotes.countDocuments();
  if (quoteCount === 0) {
    console.log('[Seed] Seeding sample quote requests...');
    await Quotes.create({
      name: 'Marcus Sterling',
      email: 'msterling@acmeventures.com',
      phone: '+1 (555) 345-6789',
      serviceRequired: 'AI Integration',
      budget: '$15,000 - $50,000',
      message: 'We require custom LLM workflows integrated with our existing Jira and Slack workspace.',
      createdAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
    });
    await Quotes.create({
      name: 'Rachel Zane',
      email: 'rachel@pearsonpartners.com',
      phone: '+1 (555) 876-5432',
      serviceRequired: 'Custom Web Development',
      budget: '$50,000+',
      message: 'Need a complete enterprise portal overhaul for 5,000 global partners.',
      createdAt: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
    });
    console.log('[Seed] Sample quotes created.');
  }

  // Seed sample newsletter subscribers if empty
  const subCount = await Newsletter.countDocuments();
  if (subCount === 0) {
    console.log('[Seed] Seeding initial newsletter subscribers...');
    await Newsletter.create({
      email: 'newsletter.subscriber1@example.com',
      subscribedAt: new Date(Date.now() - 72 * 3600 * 1000).toISOString(),
    });
    await Newsletter.create({
      email: 'newsletter.subscriber2@example.com',
      subscribedAt: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
    });
    console.log('[Seed] Sample newsletter subscriptions created.');
  }

  // Seed default employees if empty
  const empCount = await Employees.countDocuments();
  if (empCount === 0) {
    console.log('[Seed] Seeding default employees...');
    const defaultEmployees = [
      { name: 'Olivia Chen', initials: 'OC', role: 'Product Designer', dept: 'Design', email: 'olivia.chen@orbit.com', color: '#b9a8fd', status: 'Active' },
      { name: 'Ethan Williams', initials: 'EW', role: 'Senior Engineer', dept: 'Engineering', email: 'ethan.williams@orbit.com', color: '#80d3f4', status: 'Active' },
      { name: 'Sophia Martinez', initials: 'SM', role: 'Marketing Lead', dept: 'Marketing', email: 'sophia.martinez@orbit.com', color: '#ffc68c', status: 'Away' },
      { name: 'Liam Anderson', initials: 'LA', role: 'HR Specialist', dept: 'People', email: 'liam.anderson@orbit.com', color: '#a5dfb0', status: 'Active' },
      { name: 'Ava Thompson', initials: 'AT', role: 'Finance Manager', dept: 'Finance', email: 'ava.thompson@orbit.com', color: '#f5a5bf', status: 'Active' },
      { name: 'Noah Patel', initials: 'NP', role: 'Frontend Developer', dept: 'Engineering', email: 'noah.patel@orbit.com', color: '#f9df87', status: 'Offline' },
    ];
    for (const emp of defaultEmployees) {
      await Employees.create(emp);
    }
    console.log('[Seed] Default employees created.');
  }

  console.log('\n=============================================');
  console.log(' SEED COMPLETE!');
  console.log(' Admin Credentials:');
  console.log('   Email:    admin@orbitworks.com');
  console.log('   Password: AdminPassword123!');
  console.log('   Role:     admin');
  console.log('=============================================\n');

  process.exit(0);
}

seed().catch((err) => {
  console.error('[Seed Error]:', err);
  process.exit(1);
});
