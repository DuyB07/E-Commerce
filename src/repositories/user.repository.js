import sql from "mssql";
import { getPool } from "../configs/database.config.js";

export const getUserFromEmail = async (email) => {
    const pool = await getPool();
    const result = await pool.request()
        .input('email', sql.VarChar, email)
        .query('SELECT * FROM users WHERE email = @email');

    return result.recordset[0]; // Trả về user đầu hoặc undefined
};

export const createUser = async (user) => {
    const pool = await getPool();
    const result = await pool.request()
        .input('full_name', sql.NVarChar, user.fullName)
        .input('email', sql.VarChar, user.email)
        .input('password', sql.VarChar, user.password)
        .input('phone', sql.VarChar, user.phone || null)
        .query(`
            INSERT INTO users (full_name, email, password, phone, role)
            OUTPUT INSERTED.id, INSERTED.full_name, INSERTED.email, INSERTED.password, INSERTED.phone, INSERTED.role, INSERTED.created_at
            VALUES (@full_name, @email, @password, @phone, 'USER')
        `)

    return result.recordset[0];
};

export const updateUserProfile = async (userId, data) => {
    const pool = await getPool();
    const result = await pool.request()
        .input('userId', sql.Int, userId)
        .input('fullName', sql.NVarChar, data.fullName)
        .input('phone', sql.VarChar, data.phone)
        .query(`
            -- 1. Cập nhật dữ liệu
            UPDATE users
            SET full_name = @fullName, phone = @phone
            WHERE id = @userId;

            -- 2. Truy vấn lại để trả về thông tin (ko có password)
            SELECT id, full_name, email, phone, role, created_at, updated_at
            FROM users
                WHERE id = @userId;
        `);

    return result.recordset[0];
};