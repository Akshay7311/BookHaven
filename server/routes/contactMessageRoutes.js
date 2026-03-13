import express from 'express';
import { getMessages, createMessage, markAsRead, deleteMessage } from '../controllers/contactMessageController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', createMessage); // Public submission
router.get('/', protect, admin, getMessages); // Admin view
router.put('/:id/read', protect, admin, markAsRead); // Admin toggle
router.delete('/:id', protect, admin, deleteMessage); // Admin delete

export default router;
