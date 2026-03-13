import express from 'express';
import { getBanners, createBanner, updateBanner, deleteBanner } from '../controllers/bannerController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import upload from '../utils/upload.js'; // Optional Cloudinary interceptor

const router = express.Router();

router.get('/', getBanners); // Public can see banners
router.post('/', protect, admin, upload.single('image'), createBanner);
router.put('/:id', protect, admin, upload.single('image'), updateBanner);
router.delete('/:id', protect, admin, deleteBanner);

export default router;
