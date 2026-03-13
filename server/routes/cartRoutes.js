import express from 'express';
import { getCart, addToCart, updateCartItem, removeFromCart } from '../controllers/cartController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validateMiddleware.js';
import { cartSchema } from '../utils/validationSchemas.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getCart)
  .post(validate(cartSchema), addToCart);

router.route('/:id')
  .put(validate(cartSchema.pick({ quantity: true })), updateCartItem)
  .delete(removeFromCart);

export default router;
