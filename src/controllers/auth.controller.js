import * as authService from '../services/auth.service.js';

export const register = async (req, res) => {
    try {
        const { fullName, email, password, phone } = req.body;

        const newUser = await authService.register({ fullName, email, password, phone });
        
        res.status(201).json({
            success: true,
            message: 'Đăng ký tài khoản thành công',
            data: newUser
        });
    } catch (error) {
        next(error)
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const result = await authService.login(email, password);

        res.status(200).json({
            success: true,
            message: 'Đăng nhập thành công',
            data: result
        });
    } catch (error) {
        next(error)
    }
};