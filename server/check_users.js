import dotenv from 'dotenv';
dotenv.config();
import { User } from './models/index.js';
import fs from 'fs';

async function checkUsers() {
  try {
    const users = await User.findAll();
    const result = {
      count: users.length,
      users: users.map(u => ({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role
      }))
    };
    fs.writeFileSync('users_check_result.json', JSON.stringify(result, null, 2));
    console.log('User check complete. Results written to users_check_result.json');
    process.exit(0);
  } catch (err) {
    console.error('Error fetching users:', err);
    process.exit(1);
  }
}

checkUsers();
