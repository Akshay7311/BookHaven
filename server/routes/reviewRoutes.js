import express from 'express';
import { addReview, getBookReviews } from '../controllers/reviewController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/:bookId', getBookReviews);
router.post('/', protect, addReview);

export default router;
