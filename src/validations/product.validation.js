import { z } from 'zod';

export const createProductSchema = z.object({
    name: z.string().min(3, "Tên sản phẩm phải từ 3 ký tự"),
    description: z.string().optional(),
    price: z.number().positive("Giá sản phẩm phải lớn hơn 0"),
    stock: z.number().int().nonnegative("Số lượng tồn kho không được âm")
});

export const updateProductSchema = z.object({
    name: z.string().min(3, "Tên sản phẩm phải từ 3 ký tự").optional(),
    description: z.string().optional(),
    price: z.number().positive("Giá sản phẩm phải lớn hơn 0").optional(),
    isActive: z.boolean().optional()
}).refine(data => Object.keys(data).length > 0, {
    message: "Phải cung cấp ít nhất 1 trường để cập nhật"
});

export const updateStockSchema = z.object({
    stock: z.number().int().nonnegative("Số lượng tồn kho không được âm")
});