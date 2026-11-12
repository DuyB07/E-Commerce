import sql from 'mssql';
import { getPool } from '../configs/database.config.js';

export const createOrderWithTransaction = async (userId, orderData, items) => {
    const pool = await getPool();
    // 1. Khởi tạo Transaction
    const transaction = new sql.Transaction(pool);
    await transaction.begin();

    try {
        let totalPrice = 0;
        const processedItems = [];

        // 2. Kiểm tra tồn kho và tính tổng tiền
        for (const item of items) {
            const productReq = new sql.Request(transaction);
            const productRes = await productReq
                .input('id', sql.Int, item.productId) // Cái productId này là do chính tay mình gõ
                .query('SELECT id, name, price, stock, is_active FROM products WHERE id = @id');

            const product = productRes.recordset[0];

            // Validate logic DB
            if (!product || !product.is_active) {
                throw new Error(`Sản phẩm ID ${item.productId} không tồn tại hoặc ngừng bán.`);
            }
            if (product.stock < item.quantity) {
                throw new Error(`Sản phẩm "${product.name}" không đủ tồn kho (Chỉ còn ${product.stock}).`);
            }

            // Tính tiền theo giá tại tđiểm mua
            totalPrice += product.price * item.quantity;
            processedItems.push({
                productId: product.id,
                quantity: item.quantity,
                priceAtPurchase: product.price
            });
        }

        // 3. Tạo đơn hàng tổng
        const orderReq = new sql.Request(transaction);
        const orderRes = await orderReq
            .input('userId', sql.Int, userId)
            .input('totalPrice', sql.Decimal(10, 2), totalPrice)
            .input('shippingAddress', sql.NVarChar, orderData.shippingAddress)
            .input('phoneReceiver', sql.VarChar, orderData.phoneReceiver)
            .input('note', sql.NVarChar, orderData.note || '')
            .query(`
               INSERT INTO orders (user_id, total_price, shipping_address, phone_receiver, note, status)
               OUTPUT INSERTED.id
               VALUES (@userId, @totalPrice, @shippingAddress, @phoneReceiver, @note, 'PENDING') 
            `);
        
        const orderId = orderRes.recordset[0].id;

        // 4. Tạo chi tiết đơn hàng (order_items) và cập nhật trừ tồn kho (products)
        for (const item of processedItems) {
            const itemReq = new sql.Request(transaction);
            await itemReq
                .input('orderID', sql.Int, orderId)
                .input('productId', sql.Int, item.productId)
                .input('quantity', sql.Int, item.quantity)
                .input('priceAtPurchase', sql.Decimal(10, 2), item.priceAtPurchase)
                .query(`
                    -- Thêm chi tiết đơn
                    INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase)
                    VALUES (@orderId, @productId, @quantity, @priceAtPurchase);

                    -- Trừ tồn kho
                    UPDATE products
                    SET stock = stock - @quantity
                    WHERE id = @productId;
                `);
        }

        // 5. Nếu mọi thứ thành công --> Chốt lưu
        await transaction.commit();

        return {orderId, totalPrice, status: 'PENDING' };
    } catch (error) {
        // 6. Nếu có lỗi xảy ra --> Hủy full
        await transaction.rollback();
        throw error; // Ném lỗi ra cho service bắt
    }
};

// Lấy danh sách đơn hàng của user
export const getOrderByUserId = async (userId) => {
    const pool = await getPool();
    const result = await pool.request()
        .input('userId', sql.Int, userId)
        .query('SELECT * FROM orders WHERE user_id = @userId ORDER BY created_at DESC');
    return result.recordset;
};

// Admin lấy danh sách toàn bộ đơn hàng
export const getAllOrders = async () => {
    const pool = await getPool();
    const result = await pool.request()
        .query(`
            SELECT o.*, u.full_name AS buyer_name, u.email AS buyer_email, u.phone AS buyer_phone
            FROM orders o
            JOIN users u ON o.user_id = u.id
            ORDER BY o.created_at DESC
        `);
    return result.recordset;
};

// Lấy chi tiết đơn hàng
export const getOrderDetails = async (orderId) => {
    const pool = await getPool();

    // Lấy thông tin tổng quan của order
    const orderRes = await pool.request()
        .input('orderId', sql.Int, orderId)
        .query(`
            SELECT o.*, u.full_name AS buyer_name, u.email AS buyer_email, u.phone AS buyer_phone
            FROM orders o
            JOIN users u ON o.user_id = u.id    
        `);
    const order = orderRes.recordset[0];

    if (!order) return null;

    // Lấy danh sách chi tiết
    const itemsRes = await pool.request()
        .input('orderId', sql.Int, orderId)
        .query(`
          SELECT oi.id, oi.quantity, oi.price_at_purchase, p.name AS product_name
          FROM order_items oi
          JOIN products p ON oi.product_id = p.id
          WHERE oi.order_id = @orderId 
        `);

    // Gắn items vào order
    order.items = itemsRes.recordset;
    return order;
};

// Admin cập nhật trạng thái đơn hàng
export const updateOrderStatus = async (orderId, newStatus) => {
    const pool = await getPool();
    const transaction = new sql.Transaction(pool);
    await transaction.begin();
    try {
        const req = new sql.Request(transaction);
        await req
            .input('orderId', sql.Int, orderId)
            .input('status', sql.VarChar, newStatus)
            .query('UPDATE orders SET status = @status WHERE id = @orderId');

        if (newStatus === 'CANCELLED') {
            const restockReq = new sql.Request(transaction);
            await restockReq
                .input('orderId', sql.Int, orderId)
                .query(`
                    UPDATE p
                    SET p.stock = p.stock + oi.quantity
                    FROM products p
                    INNER JOIN order_items oi ON p.id = oi.product_id
                    WHERE oi.order_id = @orderId
                `);
        }

        await transaction.commit();
        const result = await pool.request()
            .input('orderId', sql.Int, orderId)
            .query('SELECT * FROM orders WHERE id = @orderId');
        return result.recordset[0];
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};