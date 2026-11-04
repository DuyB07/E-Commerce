import express from 'express';
import * as authController from '../controllers/auth.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import { registerSchema, loginSchema } from '../validations/auth.validation.js';
import { verifyToken } from '../middlewares/auth.middleware.js';
import { success } from 'zod';

const router = express.Router();

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);

router.get('/me', verifyToken, (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Lấy thông tin cá nhân thành công',
        data: req.user
    });
});

export default router;