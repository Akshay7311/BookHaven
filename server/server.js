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

dotenv.config();

const app = express();

// Security and Performance Middlewares
app.use(helmet());
app.use(morgan('common'));

// Configured CORS
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
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

const PORT = process.env.PORT || 5000;

// Force true will drop the table if it already exists, use alter: true in dev if changing models, or nothing in production
const syncDb = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database Connection established successfully.');
        
        // Use { alter: true } only for development syncing if changing schema often
        // Otherwise use sequelize-cli migrations
        if (process.env.NODE_ENV === 'development') {
            await sequelize.sync({ alter: true });
            console.log('All models were synchronized with alter:true.');
        } else {
            await sequelize.sync();
            console.log('All models synced securely for production.');
        }
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

app.listen(PORT, async () => {
  await syncDb();
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
