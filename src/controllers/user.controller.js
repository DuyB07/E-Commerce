import * as userService from '../services/user.service.js';

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