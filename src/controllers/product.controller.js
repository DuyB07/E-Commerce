import * as productService from '../services/product.service.js';

export const getAllProducts = async (req, res, next) => {
    try {
        const products = await productService.getProducts();
        res.status(200).json({
            success: true,
            data: products
        });
    } catch (error) {
        next(error);
    }
};

export const getProductById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const product = await productService.getProduct(id);
        res.status(200).json({
            success: true,
            data: product
        });
    } catch (error) {
        next(error);
    }
};

export const createProduct = async (req, res, next) => {
    try {
        // req.user được gán từ verifyToken middleware
        const newProduct = await productService.createProduct(req.body);
        res.status(201).json({
            success: true,
            message: 'Tạo sản phẩm thành công',
            data: newProduct
        });
    } catch (error) {
        next(error);
    }
};

export const updateProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updatedProduct = await productService.updateProduct(id, req.body);

        res.status(200).json({
            success: true,
            message: 'Cập nhật thông tin sản phẩm thành công',
            data: updatedProduct
        });
    } catch (error) {
        next(error);
    }
};

export const updateStock = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { stock } = req.body;

        const updatedProduct = await productService.updateStock(id, stock);

        res.status(200).json({
            success: true,
            message: 'Cập nhật tồn kho thành công',
            data: updatedProduct
        });
    } catch (error) {
        next(error);
    }
};

export const deactivateProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updatedProduct = await productService.deactivateProduct(id);

        res.status(200).json({
            success: true,
            message: 'Vô hiệu hóa sản phẩm thành công',
            data: updatedProduct
        });
    } catch (error) {
        next(error);
    }
};