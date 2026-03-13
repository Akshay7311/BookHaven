import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name must be less than 50 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const bookSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  author: z.string().min(1, 'Author is required').max(255),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.coerce.number().positive('Price must be a positive number'),
  categoryId: z.string().uuid('Invalid category ID').nullable().optional(),
  stock: z.coerce.number().int().nonnegative('Stock cannot be negative'),
});

export const cartSchema = z.object({
  bookId: z.string().uuid('Invalid book ID'),
  quantity: z.coerce.number().int().positive('Quantity must be at least 1'),
});

export const orderSchema = z.object({
  couponCode: z.string().max(20).optional().nullable(),
});
