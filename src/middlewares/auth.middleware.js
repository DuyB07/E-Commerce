import jwt from 'jsonwebtoken';
import { ErrorResponse } from '../utils/error.helper.js';

export const verifyToken = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            // Chưa xác thực danh tính
            throw new ErrorResponse('Vui lòng đăng nhập để truy cập tài nguyen này', 401);
        }

        const token = authHeader.split(' ')[1];

        // Giải mã token bằng secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Gắn thông tin payload (userID, role) vào req.user để controller sau xài
        req.user = decoded;

        next();
    } catch (error) {
        // Nếu token hết hạn hoặc sai chữ ký
        next(new ErrorResponse('Token không hợp lệ hoặc đã hết hạn', 401));
    }
};

export const requireAdmin = (req, res, next) => {
    // Phải chắc chắn verifyToken đã chạy trước đó
    if (!req.user) {
        return next(new ErrorResponse('Yêu cầu xác thực danh tính', 401));
    }

    // Biết là ai nhưng chưa đủ quyền hành
    if (req.user.role !== 'ADMIN') {
        return next(new ErrorResponse('Truy cập bị từ chối: Chỉ Admin mới có quyền thực hiện hành động này', 403));
    }

    next();
}