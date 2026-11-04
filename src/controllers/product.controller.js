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