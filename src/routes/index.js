import express from 'express';
import authRoute from './auth.route.js';
import productRoute from './product.route.js';
import orderRoute from './order.route.js';

const router = express.Router();

// Các router con
router.use('/auth', authRoute);
router.use('/products', productRoute);
router.use('/orders', orderRoute);

export default router;