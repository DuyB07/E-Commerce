import sql from 'mssql';
import { getPool } from '../configs/database.config.js';

export const getAllProducts = async () => {
    const pool = await getPool();
    const result = await pool.request().query('SELECT * FROM products WHERE is_active = 1 ORDER BY created_at DESC');
    return result.recordset;
};

export const getProductById = async (id) => {
    const pool = await getPool();
    const result = await pool.request()
        .input('id', sql.Int, id)
        .query('SELECT * FROM products WHERE id = @id');
    return result.recordset[0];
};

export const createProduct = async (productData) => {
    const pool = await getPool();
    const result = await pool.request()
        .input('name', sql.NVarChar, productData.name)
        .input('description', sql.NVarChar, productData.description || '')
        .input('price', sql.Decimal(10, 2), productData.price)
        .input('stock', sql.Int, productData.stock)
        .query(`
            INSERT INTO products (name, description, price, stock)
            VALUES (@name, @description, @price, @stock);

            SELECT * FROM products WHERE id = SCOPE_IDENTITY();
        `);
    return result.recordset[0];
};

export const updateProductInfo = async (productId, updateData) => {
    const pool = await getPool();
    const setQuery = [];
    const request = pool.request();
    request.input('id', sql.Int, productId);

    if (updateData.name) {
        setQuery.push("name = @name");
        request.input('name', sql.NVarChar, updateData.name);
    }
    if (updateData.description !== undefined) {
        setQuery.push("description = @description");
        request.input('description', sql.NVarChar, updateData.description);
    }
    if (updateData.price) {
        setQuery.push("price = @price");
        request.input('price', sql.Decimal(10, 2), updateData.price);
    }
    if (updateData.isActive) {
        setQuery.push("is_active = @isActive");
        request.input('isActive', sql.Bit, updateData.isActive);
    }

    const query = `
        UPDATE products
        SET ${setQuery.join(', ')}
        WHERE id = @id;
        
        SELECT * FROM products WHERE id = @id;
    
    `;

    const result = await request.query(query);
    return result.recordset[0];
};

export const updateProductStock = async (productId, newStock) => {
    const pool = await getPool();
    const result = await pool.request()
        .input('id', sql.Int, productId)
        .input('stock', sql.Int, newStock)
        .query(`
            UPDATE products
            SET stock = @stock
            WHERE id = @id;
            
            SELECT * FROM products WHERE id = @id;
        `);
    return result.recordset[0];
};

export const deactivateProduct = async (productId) => {
    const pool = await getPool();
    const result = await pool.request()
        .input('id', sql.Int, productId)
        .query(`
            UPDATE products
            SET is_active = 0
            WHERE id = @id;
            
            SELECT * FROM products WHERE id = @id;
        `);
    return result.recordset[0];
};