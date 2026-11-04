// Mở rộng class Error mặc định của Node.js
export class ErrorResponse extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}

export class BadRequestError extends ErrorResponse {
    constructor(message = "Bad Request", errors = []) {
        super(message, 400);
        this.errors = errors; // Chứa mảng chi tiết lỗi (vd: thiếu email, sai pass)
    }
}

export class NotFoundError extends ErrorResponse {
    constructor(message = "Not Found") {
        super(message, 404);
    }
}