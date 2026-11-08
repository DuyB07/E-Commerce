import { z } from 'zod';

export const updateProfileSchema = z.object({
    fullName: z.string().min(3, "Họ tên phải có ít nhất 3 ký tự"),
    phone: z.string().min(9, "Số điện thoại không hợp lệ")
});