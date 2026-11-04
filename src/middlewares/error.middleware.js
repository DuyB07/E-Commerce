// Middleware bắt lỗi 404
export const notFoundHandler = (req, res, next) => {
    const error = new Error(`Không tìm thấy đường dẫn: ${req.method} ${req.originalUrl}`);
    error.statusCode = 404;
    next(error);
};

// Middleware xử lý lỗi tổng
export const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;

    const response = {
        success: false,
        status: statusCode,
        message: err.message || "Lỗi hệ thống nội bộ",
    };

    // Nếu có mảng lỗi chi tiết
    if (err.errors) {
        response.errors = err.errors;
    }

    res.status(statusCode).json(response);
};