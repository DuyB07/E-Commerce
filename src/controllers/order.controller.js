import * as orderService from '../services/order.service.js';

export const createOrder = async (req, res, next) => {
    try {
        const userId = req.user.userId; // Lấy ID của user đang đăng nhập từ token
        const { shippingAddress, phoneReceiver, note, items } = req.body;

        const result = await orderService.createOrder(userId, { shippingAddress, phoneReceiver, note }, items);

        res.status(201).json({
            success: true,
            message: 'Tạo đơn hàng thành công',
            data: result
        });
    } catch (error) {
        next(error);
    }
};

export const getMyOrders = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const orders = await orderService.getMyOrders(userId);
        res.status(200).json({
            success: true,
            data: orders
        });
    } catch (error) {
        next(error);
    }
};

export const getOrderDetails = async (req, res, next) => {
    try {
        const orderId = req.params.id;
        const user = req.user; // Lấy từ token

        const order = await orderService.getOrderById(orderId, user);
        res.status(200).json({
            success: true,
            data: order
        });
    } catch (error) {
        next(error);
    }
};

export const updateOrderStatus = async (req, res, next) => {
    try {
        const orderId = req.params.id;
        const { status } = req.body;

        const updateOrder = await orderService.updateOrderStatus(orderId, status);
        res.status(200).json({
            success: true,
            mesage: 'Cập nhật trạng thái thành công',
            data: updateOrder
        });
    } catch (error) {
        next(error);
    }
};