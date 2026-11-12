import * as userRepo from '../repositories/user.repository.js';
import { NotFoundError } from '../utils/error.helper.js';

export const getUser = async (userId) => {
    return await userRepo.getUserById(userId);
};

export const updateProfile = async (userId, data) => {
    const updatedUser = await userRepo.updateUserProfile(userId, data);

    if (!updatedUser) {
        throw new NotFoundError('Không tìm thấy tài khoản người dùng');
    }

    return updatedUser;
};