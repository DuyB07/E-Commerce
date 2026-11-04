// Chặn nếu Client gửi sai dữ liệu
import { BadRequestError } from '../utils/error.helper.js';
import { z } from 'zod';

export const validate = (schema) => {
    return (req, res, next) => {
        try {
            // Nếu dữ liệu sai, ném ra ZodError
            const validData = schema.parse(req.body);

            // Nếu đúng, gán lại dữ liệu đã đc làm sạch vào req.body
            req.body = validData;
            next();
        } catch (error) {
            // Nếu lỗi là do Zod
            if (error instanceof z.ZodError) {
                const errors = error.issues.map(err => ({
                    field: err.path.join('.'),
                    message: err.message
                }));

                return next(new BadRequestError("Dữ liệu đầu vào không hợp lệ", errors));
            }

            next(error); // Nếu là lỗi khác
        }
    };
};