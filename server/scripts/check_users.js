import dotenv from 'dotenv';
dotenv.config();
import { User } from '../models/index.js';
import fs from 'fs';
import path from 'path';

async function checkUsers() {
  try {
    const users = await User.findAll({
      attributes: ['id', 'name', 'email', 'role']
    });
    
    const result = {
      count: users.length,
      users: users.map(u => u.toJSON())
    };
    
    const reportPath = path.join(process.cwd(), 'cleanup_report.json');
    fs.writeFileSync(reportPath, JSON.stringify(result, null, 2));
    
    console.log(`User check complete. Found ${users.length} users.`);
    console.log(`Results written to: ${reportPath}`);
    
    if (users.length > 0) {
      console.table(result.users);
    }
    
    process.exit(0);
  } catch (err) {
    console.error('Error fetching users:', err);
    process.exit(1);
  }
}

checkUsers();
