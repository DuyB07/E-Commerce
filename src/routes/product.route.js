import express from 'express';
import * as productController from '../controllers/product.controller.js';
import { verifyToken, requireAdmin } from '../middlewares/auth.middleware.js';
import { createProductSchema, updateProductSchema, updateStockSchema } from '../validations/product.validation.js';
import { validate } from '../middlewares/validate.middleware.js';

const router = express.Router();

router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);

router.use(verifyToken, requireAdmin);

// Thêm spham
router.post('/', validate(createProductSchema), productController.createProduct);

// Cập nhật thông tin
router.patch('/:id', validate(updateProductSchema), productController.updateProduct);

// Cập nhật tồn kho
router.patch('/:id/stock', validate(updateStockSchema), productController.updateStock);

// Vô hiệu hóa
router.delete('/:id', productController.deactivateProduct);

export default router;