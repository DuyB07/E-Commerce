import * as productRepo from '../repositories/product.repository.js';
import { NotFoundError } from '../utils/error.helper.js';

export const getProducts = async () => {
    return await productRepo.getAllProducts();
};

export const getProduct = async (id) => {
    const product = await productRepo.getProductById(id);
    if (!product || !product.is_active) {
        throw new NotFoundError('Không tìm thấy sản phẩm này');
    }
    return product;
};

export const createProduct = async (productData) => {
    return await productRepo.createProduct(productData);
};

export const updateProduct = async (productId, updateData) => {
    const product = await productRepo.getProductById(productId);
    if (!product) {
        throw new NotFoundError('Không tìm thấy sản phẩm này');
    }

    return await productRepo.updateProductInfo(productId, updateData);
};

export const updateStock = async (productId, newStock) => {
    await getProduct(productId);
    return await productRepo.updateProductStock(productId, newStock);
};

export const deactivateProduct = async (productId) => {
    await getProduct(productId);
    return await productRepo.deactivateProduct(productId);
};