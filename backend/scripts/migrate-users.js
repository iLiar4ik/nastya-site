const { Pool } = require('pg');
const bcrypt = require('bcrypt');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

async function migrateUsers() {
  const client = await pool.connect();
  
  try {
    console.log('Starting user migration from localStorage format...');
    
    // This script would read from a JSON file exported from localStorage
    // For now, it's a template that can be used when actual data is available
    
    const sampleUsers = [
      {
        email: 'teacher@nastya.com',
        password: 'teacher123',
        name: 'Настя',
        role: 'teacher'
      },
      {
        email: 'admin@nastya.com',
        password: 'admin123',
        name: 'Админ',
        role: 'admin'
      }
    ];

    for (const userData of sampleUsers) {
      // Check if user exists
      const existingUser = await client.query(
        'SELECT id FROM users WHERE email = $1',
        [userData.email]
      );

      if (existingUser.rows.length > 0) {
        console.log(`User ${userData.email} already exists, skipping...`);
        continue;
      }

      // Hash password
      const passwordHash = await bcrypt.hash(userData.password, 10);

      // Insert user
      await client.query(
        'INSERT INTO users (email, password_hash, name, role) VALUES ($1, $2, $3, $4)',
        [userData.email, passwordHash, userData.name, userData.role]
      );

      console.log(`✓ Migrated user: ${userData.email}`);
    }

    console.log('User migration completed!');
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

migrateUsers().catch(console.error);


