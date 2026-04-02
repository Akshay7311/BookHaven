import dotenv from 'dotenv';
dotenv.config();
import { User } from '../models/index.js';
import sequelize from '../config/db.js';

const ALLOWED_EMAIL = process.env.MAIL_USER || 'javewe6de3oidv6q@ethereal.email';

async function cleanupUsers() {
  try {
    console.log(`Starting cleanup. Keeping user: ${ALLOWED_EMAIL}`);
    
    // Test connection
    await sequelize.authenticate();
    
    const deletedCount = await User.destroy({
      where: {
        email: {
          [sequelize.Sequelize.Op.ne]: ALLOWED_EMAIL
        }
      }
    });

    console.log(`Cleanup complete. Deleted ${deletedCount} users.`);
    process.exit(0);
  } catch (err) {
    console.error('Error during cleanup:', err);
    process.exit(1);
  }
}

cleanupUsers();
