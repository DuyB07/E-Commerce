import { z } from 'zod';

export const createOrderSchema = z.object({
    shippingAddress: z.string().min(5, "Địa chỉ giao hàng quá ngắn"),
    phoneReceiver: z.string().min(9, "Số điện thoại không hợp lệ"),
    note: z.string().optional(),
    items: z.array(z.object({
        productId: z.number().int().positive("ID sản phẩm không hợp lệ"),
        quantity: z.number().int().positive("Số lượng phải lớn hơn 0")
    })).min(1, "Đơn hàng phải có ít nhất 1 sản phẩm")
});