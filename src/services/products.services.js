import { productsModel } from "../models/products.model.js";

class ProductsService {

    async getAll() {
        return await productsModel.find();
    }

    async getById({ id }) {
        return await productsModel.findById(id);
    }

    async create({ title, description, code, price, status, stock, category }) {

        const product = new productsModel({
            title,
            description,
            code,
            price,
            status,
            stock,
            category
        });

        return await product.save();

    }

    async update({ id, title, description, code, price, stock, category }) {
        const updatedProduct = await productsModel.findByIdAndUpdate(id, {
            title,
            description,
            code,
            price,
            stock,
            category
        }, { new: true });
        return updatedProduct;
    }

    async delete({ id }) {
        return await productsModel.findByIdAndDelete(id);
    }
    async getPaginate({ page = 1, limit = 10 }) {
        const options = {
            page,
            limit
        }
        return await productsModel.paginate({}, options);

    }
}

export const productsService = new ProductsService()