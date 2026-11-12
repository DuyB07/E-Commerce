import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as userRepository from '../repositories/user.repository.js'
import { BadRequestError, ErrorResponse } from '../utils/error.helper.js';

export const register = async (userData) => {
    // Kiểm tra email đã tồn tại chưa
    const existingUser = await userRepository.getUserFromEmail(userData.email);
    if (existingUser){
        throw new BadRequestError('Email này đã được sử dụng!');
    }

    // Hash mật khẩu trước khi lưu
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

    // Gọi repo để lưu vào DB
    const newUser = await userRepository.createUser({...userData, password: hashedPassword});

    return newUser; // lúc này newUser sẽ ko có cột password nữa mà là hased pass
};

export const login = async (email, password) => {
    // Tìm user bằng email
    const user = await userRepository.getUserFromEmail(email);
    if (!user){
        throw new ErrorResponse('Email hoặc mật khẩu không chính xác!', 401);
    }

    // So sánh mật khẩu client gửi với hash pass trong DB
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch){
        throw new ErrorResponse('Email hoặc mật khẩu không chính xác!', 401);
    }

    // Tạo Payload và Ký JWT
    const payload = {
        userId: user.id,
        role: user.role
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });

    // Xóa field password ra khỏi object user trc khi trả về client
    const { password: _, ...safeUser } = user;

    return {
        user: safeUser,
        accessToken: token
    };
};