import { cartsModel } from "../models/carts.model.js";
import { productsModel } from "../models/products.model.js";
import mongoose from "mongoose";

class CartsService {
    async getAll() {
        return await cartsModel.find().populate('products.productId');
    }
    async getById(id) {
        return await cartsModel.findById(id).populate('products.productId');
    }
    async create() {

        try {
            const newCart = new cartsModel({ products: [], totalPrice: 0 });
            await newCart.save();
            return newCart;
        } catch (error) {
            throw new Error("Error al guardar el archivo del carrito");
        }
    }

    async addProduct({ cid, pid, quantity }) {
        if (quantity <= 0) throw new Error("La cantidad debe ser mayor a 0");
        const cart = await cartsModel.findById(cid);
        if (!cart) {
            throw new Error("Carrito no encontrado");
        }

        const productId = new mongoose.Types.ObjectId(pid);
        const product = await productsModel.findById(productId);
        if (!product) {
            throw new Error("Producto no encontrado");
        }
        const existingProduct = cart.products.find(product => product.productId.equals(pid));
        if (existingProduct) {
            existingProduct.quantity += quantity;
        } else {
            cart.products.push({ productId: productId, quantity });
        }
        await cart.calculateTotalPrice();
        return await cart.save();
    }

    async updateProduct({ cid, pid, quantity }) {
        if (quantity <= 0) throw new Error("La cantidad debe ser mayor a 0");
        const cart = await cartsModel.findById(cid);
        if (!cart) {
            return null;
        }
        const product = cart.products.find(product => product.productId.equals(pid));
        if (!product) {
            return null;
        }
        product.quantity = quantity;
        await cart.calculateTotalPrice();
        return await cart.save();
    }

    async removeProduct({ cid, pid }) {
        const cart = await cartsModel.findById(cid);
        if (!cart) {
            return { message: "Carrito no encontrado" };
        }
        const productIndex = cart.products.findIndex(product => product.productId.equals(pid));
        if (productIndex === -1) {
            return { message: "Producto no encontrado en el carrito" };
        }

        cart.products.splice(productIndex, 1);
        await cart.calculateTotalPrice();
        await cart.save();
        return { message: "Producto eliminado del carrito", cart };
    }

    async deleteCart(cid) {
        const result = await cartsModel.findByIdAndDelete(cid);
        if (!result) {
            return null;

        }
        return result;
    }

    async confirmFunko({ cid }) {
        const cart = await cartsModel.findById(cid).populate('products.productId');
        if (!cart) return { message: "Carrito no encontrado" };

        const total = cart.products.reduce((acc, product) => { return acc + product.productId.price * product.quantity }, 0);
        cart.totalPrice = total;
        cart.products = [];
        await cart.save();
        return { message: "Compra confirmada", total };
    }
}
export const cartsService = new CartsService()