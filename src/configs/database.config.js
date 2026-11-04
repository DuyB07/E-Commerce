import sql from 'mssql';
import dotenv from 'dotenv';

dotenv.config();

// --> Cấu hình kết nối với SQL Server
const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT || 1433),
    options: {
        encrypt: process.env.DB_ENCRYPT === 'true', // Use true for Azure, false for local
        trustServerCertificate: process.env.DB_TRUST_SERVER_CERTIFICATE === 'true', 
    }
};

// --> Khởi tạo Connection Pool
const poolPromise = new sql.ConnectionPool(dbConfig)
    .connect()
    .then(pool => {
        console.log('✅ Kết nối Database SQL Server thành công!');
        return pool;
    })
    .catch(err => {
        console.error('❌ Lỗi kết nối Database SQL Server:', err.message);
        process.exit(1); // Dừng server nếu không kết nối được DB
    });

// --> Lấy pool kết nối để dùng ở các file khác
export const getPool = async () => {
    return await poolPromise;
};

// Hàm kiểm tra kết nối (được gọi ở index.js)
export const checkDBConnection = async () => {
    try {
        await poolPromise;
    } catch (error) {
        console.error('Lỗi khi kiểm tra kết nối:', error);
    }
};

export default sql;