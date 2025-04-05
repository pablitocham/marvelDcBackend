import { cartsModel } from '../../models/carts.model.js';
import { CartDTO } from '../../dto/cart.dto.js';
import mongoose from 'mongoose';

export class CartMongoDAO {
  async create() {
    try {
      const newCart = await cartsModel.create({ products: [], totalPrice: 0 });
      return new CartDTO(newCart);
    } catch (error) {
      throw new Error(`Error creating cart: ${error.message}`);
    }
  }

  async getAll() {
    try {
      const carts = await cartsModel.find().populate('products.productId').lean();
      return carts.map(cart => new CartDTO(cart));
    } catch (error) {
      throw new Error(`Error getting carts: ${error.message}`);
    }
  }

  async getById(id) {
    try {
      const cart = await cartsModel.findById(id).populate('products.productId').lean();
      return cart ? new CartDTO(cart) : null;
    } catch (error) {
      throw new Error(`Error getting cart by ID: ${error.message}`);
    }
  }

  async addProduct(cid, pid, quantity) {
    try {
      const cart = await cartsModel.findById(cid);
      if (!cart) throw new Error("Cart not found");

      const productId = new mongoose.Types.ObjectId(pid);
      const existingProduct = cart.products.find(p => p.productId.equals(pid));

      if (existingProduct) {
        existingProduct.quantity += quantity;
      } else {
        cart.products.push({ productId, quantity });
      }

      await cart.calculateTotalPrice();
      await cart.save();
      return new CartDTO(cart);
    } catch (error) {
      throw new Error(`Error adding product to cart: ${error.message}`);
    }
  }

  async updateProduct(cid, pid, quantity) {
    try {
      const cart = await cartsModel.findById(cid);
      if (!cart) throw new Error("Cart not found");

      const product = cart.products.find(p => p.productId.equals(pid));
      if (!product) throw new Error("Product not found in cart");

      product.quantity = quantity;
      await cart.calculateTotalPrice();
      await cart.save();
      return new CartDTO(cart);
    } catch (error) {
      throw new Error(`Error updating product in cart: ${error.message}`);
    }
  }

  async removeProduct(cid, pid) {
    try {
      const cart = await cartsModel.findById(cid);
      if (!cart) throw new Error("Cart not found");

      const productIndex = cart.products.findIndex(p => p.productId.equals(pid));
      if (productIndex === -1) throw new Error("Product not found in cart");

      cart.products.splice(productIndex, 1);
      await cart.calculateTotalPrice();
      await cart.save();
      return new CartDTO(cart);
    } catch (error) {
      throw new Error(`Error removing product from cart: ${error.message}`);
    }
  }

  async delete(id) {
    try {
      return await cartsModel.findByIdAndDelete(id);
    } catch (error) {
      throw new Error(`Error deleting cart: ${error.message}`);
    }
  }

  async emptyCart(id) {
    try {
      const cart = await cartsModel.findById(id);
      if (!cart) throw new Error("Cart not found");

      cart.products = [];
      await cart.calculateTotalPrice();
      await cart.save();
      return new CartDTO(cart);
    } catch (error) {
      throw new Error(`Error emptying cart: ${error.message}`);
    }
  }
}

