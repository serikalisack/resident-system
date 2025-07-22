// seedUsers.js
const bcrypt = require('bcryptjs');
const db = require('./db'); // your MySQL connection

async function seedUsers() {
  try {
    // Passwords in plain text
    const users = [
      {
        username: 'adminuser',
        password: 'admin123',
        role: 'Admin',
        email: 'admin@example.com',
        phone: '+255700000001',
      },
      {
        username: 'shehauser',
        password: 'sheha123',
        role: 'Sheha',
        email: 'sheha@example.com',
        phone: '+255700000002',
      },
    ];

    for (const user of users) {
      // Hash the password
      const hashedPassword = await bcrypt.hash(user.password, 10);

      // Insert user into DB
      await new Promise((resolve, reject) => {
        const query = `
          INSERT INTO users (id, username, password_hash, role, email, phone, created_at, last_login, is_active)
          VALUES (UUID(), ?, ?, ?, ?, ?, NOW(), NOW(), TRUE)
        `;
        const params = [user.username, hashedPassword, user.role, user.email, user.phone];

        db.query(query, params, (err, results) => {
          if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
              console.log(`User ${user.username} already exists. Skipping...`);
              resolve();
            } else {
              reject(err);
            }
          } else {
            console.log(`User ${user.username} inserted successfully.`);
            resolve();
          }
        });
      });
    }

    console.log('✅ Seeding users completed.');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding users:', err);
    process.exit(1);
  }
}

seedUsers();
