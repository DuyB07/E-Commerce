import * as userService from '../services/user.service.js';

export const getUser = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const userInfo = await userService.getUser(userId);
        res.status(200).json({
            success: true,
            message: 'Lấy thông tin cá nhân thành công',
            data: userInfo
        });
    } catch (error) {
        next(error);
    }
};

export const updateProfile = async (req, res, next) => {
    try {
        // Lấy userId từ token đã được giải trong auth.middleware
        const userId = req.user.userId;

        // Lấy dữ liệu hợp lệ từ body (đã qua zod validation)
        const { fullName, phone } = req.body

        const updatedUser = await userService.updateProfile(userId, { fullName, phone });

        res.status(200).json({
            success: true,
            message: 'Cập nhật thông tin cá nhân thành công',
            data: updatedUser
        });
    } catch (error) {
        next(error);
    }
};