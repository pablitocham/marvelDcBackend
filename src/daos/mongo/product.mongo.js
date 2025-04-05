import { productsModel } from '../../models/products.model.js';
import { ProductDTO } from '../../dto/product.dto.js';

export class ProductMongoDAO {
  async create(productData) {
    try {
      const newProduct = await productsModel.create(productData);
      return new ProductDTO(newProduct);
    } catch (error) {
      throw new Error(`Error creating product: ${error.message}`);
    }
  }

  async getAll() {
    try {
      const products = await productsModel.find().lean();
      return products.map(product => new ProductDTO(product));
    } catch (error) {
      throw new Error(`Error getting products: ${error.message}`);
    }
  }

  async getById(id) {
    try {
      const product = await productsModel.findById(id).lean();
      return product ? new ProductDTO(product) : null;
    } catch (error) {
      throw new Error(`Error getting product by ID: ${error.message}`);
    }
  }

  async update(id, productData) {
    try {
      const updatedProduct = await productsModel.findByIdAndUpdate(id, productData, { new: true }).lean();
      return updatedProduct ? new ProductDTO(updatedProduct) : null;
    } catch (error) {
      throw new Error(`Error updating product: ${error.message}`);
    }
  }

  async delete(id) {
    try {
      return await productsModel.findByIdAndDelete(id);
    } catch (error) {
      throw new Error(`Error deleting product: ${error.message}`);
    }
  }

  async paginate(filter, options) {
    try {
      const result = await productsModel.paginate(filter, options);
      return {
        ...result,
        docs: result.docs.map(product => new ProductDTO(product))
      };
    } catch (error) {
      throw new Error(`Error paginating products: ${error.message}`);
    }
  }
}
