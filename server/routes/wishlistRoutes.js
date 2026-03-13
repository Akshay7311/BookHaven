import express from 'express';
import { getUserWishlist, toggleWishlistItem } from '../controllers/wishlistController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getUserWishlist);
router.post('/toggle', protect, toggleWishlistItem);

export default router;
