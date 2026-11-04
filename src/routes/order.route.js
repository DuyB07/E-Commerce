import express from 'express';
import * as orderController from '../controllers/order.controller.js';
import { requireAdmin, verifyToken } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { createOrderSchema } from '../validations/order.validation.js';

const router = express.Router();

router.use(verifyToken);

router.post('/', validate(createOrderSchema), orderController.createOrder);

router.get('/me', orderController.getMyOrders);

router.get('/admin', requireAdmin, orderController.getAllOrders);

router.patch('/:id/status', requireAdmin, orderController.updateOrderStatus);

router.get('/:id', orderController.getOrderDetails);

export default router;