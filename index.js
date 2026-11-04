import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import { checkDBConnection } from "./src/configs/database.config.js";
import rootRouter from './src/routes/index.js';
import { errorHandler, notFoundHandler } from "./src/middlewares/error.middleware.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(morgan('dev'));

checkDBConnection();

// Định tuyến API chính
app.use('/api', rootRouter);

// Bắt lỗi 404
app.use(notFoundHandler);

// Xử lý mọi lỗi
app.use(errorHandler);

app.get('/', (req, res) => {
    res.status(200).json({message: "Welcome to E-commerce!"});
});

app.listen(PORT, () => {
    console.log(`Server đang chạy tại http://localhost:${PORT}`);
});

