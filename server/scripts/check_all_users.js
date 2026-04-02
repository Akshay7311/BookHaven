import dotenv from 'dotenv';
dotenv.config();
import { User } from '../models/index.js';
import fs from 'fs';

async function checkAll() {
  try {
    const users = await User.findAll({ order: [['role', 'ASC']] });
    fs.writeFileSync('all_users.json', JSON.stringify(users.map(u => u.toJSON()), null, 2));
    console.log('Results written to all_users.json');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
checkAll();
