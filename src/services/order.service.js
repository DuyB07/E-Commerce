import * as orderRepo from '../repositories/order.repository.js';
import { NotFoundError, BadRequestError, ErrorResponse } from '../utils/error.helper.js';

export const createOrder = async (userId, orderData, items) => {
    try {
        const newOrder = await orderRepo.createOrderWithTransaction(userId, orderData, items);
        return newOrder;
    } catch (error) {
        // Chuyển lỗi từ DB thành error 400
        throw new BadRequestError(error.message);
    }
};

export const getMyOrders = async (userId) => {
    return await orderRepo.getOrderByUserId(userId);
};

export const getAllOrders = async () => {
    return await orderRepo.getAllOrders();
};

export const getOrderById = async (orderId, user) => {
    const order = await orderRepo.getOrderDetails(orderId);

    if (!order) {
        throw new NotFoundError('Không tìm thấy đơn hàng này');
    }

    // Nếu là user, chỉ được xem đơn của chính mình
    if (user.role === 'USER' && order.user_id !== user.userId) {
        throw new ErrorResponse('Bạn không có quyền xem đơn hàng của người khác', 403);
    }

    return order;
};

export const updateOrderStatus = async (orderId, newStatus) => {
    // Validate trạng thái hợp lệ
    const validStatuses = ['PENDING', 'SHIPPING', 'DELIVERED', 'CANCELLED'];
    if (!validStatuses.includes(newStatus)) {
        throw new BadRequestError('Trạng thái không hợp lệ');
    }

    // Lấy thông tin đơn hàng hiện tại để ktra
    const currentOrder = await orderRepo.getOrderDetails(orderId);
    if (!currentOrder) {
        throw new NotFoundError("Không tìm thấy đơn hàng để cập nhật");
    }

    // Nếu đã DELIVERED hoặc CANCELLED thì ko cho đổi nữa
    if (currentOrder.status === 'DELIVERED' || currentOrder.status === 'CANCELLED') {
        throw new BadRequestError('Đơn hàng đã kết thúc, không thể thay đổi trạng thái');
    }

    const allowedTransitions = {
        PENDING: ['SHIPPING', 'CANCELLED'],
        SHIPPING: ['DELIVERED'],
        DELIVERED: [],
        CANCELLED: []
    };

    if (!allowedTransitions[currentOrder.status].includes(newStatus)) {
        throw new BadRequestError(`Không thể chuyển trạng thái từ ${currentOrder.status} sang ${newStatus}`)
    }

    return await orderRepo.updateOrderStatus(orderId, newStatus);
};