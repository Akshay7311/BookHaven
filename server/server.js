import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

import { sequelize } from './models/index.js'; // Imports models & associations

import authRoutes from './routes/authRoutes.js';
import bookRoutes from './routes/bookRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import userRoutes from './routes/userRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import couponRoutes from './routes/couponRoutes.js';
import bannerRoutes from './routes/bannerRoutes.js';
import contactMessageRoutes from './routes/contactMessageRoutes.js';
import wishlistRoutes from './routes/wishlistRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import { seedSystemBanners } from './utils/seedHelper.js';

dotenv.config();

const app = express();

// Security and Performance Middlewares
app.use(helmet());
app.use(morgan('common'));

// Configured CORS to allow both local development and live Vercel store
const allowedOrigins = [
  'http://localhost:5173',
  'https://bookhaven-store-omega.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Rate Limiting to prevent DDoS
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 2000 // Increased limit to protect against dev environment loop false-positives
});
app.use('/api', limiter);

app.use(express.json());

// Main Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/banners', bannerRoutes);
app.use('/api/contact', contactMessageRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/reviews', reviewRoutes);

app.get('/', (req, res) => {
    res.send('BookHaven API is running...');
});

// Health Check Endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'OK', uptime: process.uptime() });
});

// Centralized Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error',
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
    });
});

const PORT = process.env.PORT || 5001;

// Force true will drop the table if it already exists, use alter: true in dev if changing models, or nothing in production
const syncDb = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database Connection established successfully.');
        
        // Use { alter: true } only for development syncing if changing schema often
        // Otherwise use sequelize-cli migrations
        // Use { alter: true } to ensure your live Render DB gets the new color, subtitle, and is_system columns automatically
        try {
            await sequelize.sync({ alter: true });
            console.log('✅ Database Synchronized (alter:true).');
        } catch (syncError) {
            console.warn('⚠️ Sync with alter:true failed, falling back to basic sync:', syncError.message);
            await sequelize.sync();
        }
        
        // Seed system banners automatically if they don't exist
        await seedSystemBanners();
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

app.listen(PORT, async () => {
  await syncDb();
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
