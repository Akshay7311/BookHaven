import express from 'express';
import { getBooks, getBookById, createBook, updateBook, deleteBook } from '../controllers/bookController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validateMiddleware.js';
import { bookSchema } from '../utils/validationSchemas.js';
import upload from '../utils/upload.js'; // The Multer/Cloudinary setup

const router = express.Router();

router.get('/', getBooks);
router.get('/:id', getBookById);

// Admin exclusive actions with Multer Image Parsing and Zod Validation
router.post('/', protect, admin, upload.single('image'), validate(bookSchema), createBook);
router.put('/:id', protect, admin, upload.single('image'), validate(bookSchema), updateBook);
router.delete('/:id', protect, admin, deleteBook);

export default router;
