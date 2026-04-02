import dotenv from 'dotenv';
dotenv.config();
import { User } from '../models/index.js';
import bcrypt from 'bcrypt';

const EMAIL = process.env.MAIL_USER || 'javewe6de3oidv6q@ethereal.email';
const PASSWORD = 'password123'; // Default password for testing

async function seedUser() {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(PASSWORD, salt);

    const [user, created] = await User.findOrCreate({
      where: { email: EMAIL },
      defaults: {
        name: 'Ethereal Tester',
        password: hashedPassword,
        role: 'user' // Consumer
      }
    });

    if (created) {
      console.log(`User created: ${EMAIL}`);
    } else {
      console.log(`User already exists: ${EMAIL}`);
    }
    process.exit(0);
  } catch (err) {
    console.error('Error seeding user:', err);
    process.exit(1);
  }
}

seedUser();
