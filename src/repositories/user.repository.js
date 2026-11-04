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



