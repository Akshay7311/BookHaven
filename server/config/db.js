import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

const dbConfig = process.env.DATABASE_URL ? [process.env.DATABASE_URL] : [
  process.env.DB_NAME || 'bookhaven_db',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: false,
    pool: { max: 5, min: 0, acquire: 30000, idle: 10000 },
    define: {
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci',
      timestamps: true,
      underscored: true
    }
  }
];

const sequelize = new Sequelize(...dbConfig);

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Production MySQL connection has been established successfully via Sequelize.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
};

export default sequelize;
