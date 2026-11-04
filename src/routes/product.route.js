import express from 'express';
import * as productController from '../controllers/product.controller.js';
import { verifyToken, requireAdmin } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);

// Phải có token --> quyền admin mới có thể chỉnh sửa được
router.post('/', verifyToken, requireAdmin, productController.createProduct);

export default router;