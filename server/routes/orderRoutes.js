import express from 'express';
import { createOrder, getMyOrders, getOrders, updateOrderStatus, getAdminStats } from '../controllers/orderController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validateMiddleware.js';
import { orderSchema } from '../utils/validationSchemas.js';

const router = express.Router();

router.route('/')
  .post(protect, validate(orderSchema), createOrder)
  .get(protect, admin, getOrders);

router.get('/myorders', protect, getMyOrders);
router.get('/stats', protect, admin, getAdminStats);

router.put('/:id/status', protect, admin, updateOrderStatus);

export default router;
