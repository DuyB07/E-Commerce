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
            OUTPUT INSERTED.*
            VALUES (@name, @description, @price, @stock)
        `);
    return result.recordset[0];
};

