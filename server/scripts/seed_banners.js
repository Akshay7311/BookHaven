import { sequelize } from '../models/index.js';
import { seedSystemBanners } from '../utils/seedHelper.js';

const runSeeder = async () => {
    try {
        await sequelize.sync();
        await seedSystemBanners();
        console.log('Seeding completed successfully (via script).');
        process.exit(0);
    } catch (error) {
        console.error('Error in seeder script:', error);
        process.exit(1);
    }
};

runSeeder();
