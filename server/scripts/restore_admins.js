import dotenv from 'dotenv';
dotenv.config();
import { User } from '../models/index.js';
import bcrypt from 'bcrypt';

const ADMINS = [
  {
    name: 'Store Admin',
    email: 'admin@bookhaven.com',
    password: 'bookhaven123',
    role: 'admin'
  },
  {
    name: 'Store Owner',
    email: 'owner@bookhaven.com',
    password: 'bookhaven123',
    role: 'admin'
  }
];

async function restoreAdmins() {
  try {
    const salt = await bcrypt.genSalt(10);
    
    for (const adminData of ADMINS) {
      const hashedPassword = await bcrypt.hash(adminData.password, salt);
      const [user, created] = await User.findOrCreate({
        where: { email: adminData.email },
        defaults: {
          name: adminData.name,
          password: hashedPassword,
          role: adminData.role
        }
      });

      if (created) {
        console.log(`Admin created: ${adminData.email}`);
      } else {
        console.log(`Admin already exists: ${adminData.email}`);
      }
    }
    process.exit(0);
  } catch (err) {
    console.error('Error restoring admins:', err);
    process.exit(1);
  }
}

restoreAdmins();
