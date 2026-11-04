import * as productRepo from '../repositories/product.repository.js';
import { NotFoundError } from '../utils/error.helper.js';

export const getProducts = async () => {
    return await productRepo.getAllProducts();
};

export const getProduct = async (id) => {
    const product = await productRepo.getProductById(id);
    if (!product) {
        throw new NotFoundError('Không tìm thấy sản phẩm này');
    }
    return product;
};

export const createProduct = async (productData) => {
    return await productRepo.createProduct(productData);
};