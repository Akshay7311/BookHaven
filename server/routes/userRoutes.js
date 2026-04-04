import express from 'express';
import { getUsers, createUser, getUserById, updateUser, deleteUser, uploadAvatar } from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import upload from '../utils/upload.js';

const router = express.Router();

router.post('/profile/avatar', protect, upload.single('image'), uploadAvatar);

router.get('/', protect, admin, getUsers);
router.post('/', protect, admin, createUser);
router.get('/:id', protect, admin, getUserById);
router.put('/:id', protect, admin, updateUser);
router.delete('/:id', protect, admin, deleteUser);

export default router;
