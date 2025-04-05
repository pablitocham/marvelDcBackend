import { cartsService } from "../services/carts.service.js";
import { cartsModel } from "../models/carts.model.js";
import { ticketModel } from "../models/ticket.model.js";
import { v4 as uuidv4 } from "uuid";

export const getAllCarts = async (req, res) => {
    try {
        const carts = await cartsService.getAll();
        res.status(200).json(carts);
    } catch (error) {
        res.status(500).json({ message: "Internal server error no de puedo obtener los carritos" });
    }
};

export const getCartById = async (req, res) => {
    const { cid } = req.params;
    try {
        const cart = await cartsService.getById(cid);
        if (!cart) {
            return res.status(404).json({ message: "Carrito no encontrado" });
        }
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: "Internal server error al obtener todos los carritos" });
    }
};

export const createCart = async (req, res) => {
    try {
        const newCart = await cartsService.create();
        if (!newCart) return res.status(404).json({ message: "Error al crear el carrito" });
        res.status(201).json(newCart);
    } catch (error) {
        res.status(500).json({ message: "Error al crear el carrito" });
    }
};

export const addProductToCart = async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;
        console.log("🛒 Agregando producto:", pid, "al carrito:", cid);

        const updateCart = await cartsService.addProduct({ cid, pid, quantity });
        if (!updateCart) return res.status(404).json({ message: "Producto no encontrado" });
        res.status(200).json(updateCart);

    } catch (error) {
        console.error("❌ Error al agregar producto:", error);
        res.status(500).json({
            message: "Error al agregar el producto al carrito", error: error.message
        });
    }
};

export const updateProductInCart = async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;
        const updateCart = await cartsService.updateProduct({ cid, pid, quantity });
        if (!updateCart) return res.status(404).json({ message: "Producto no encontrado" });
        res.status(200).json(updateCart);
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar la cantidad del producto del carrito", error: error.message });
    }
};

export const removeProductFromCart = async (req, res) => {
    const { cid, pid } = req.params;
    try {
        const result = await cartsService.removeProduct({ cid, pid });
        if (result.message) {
            return res.status(404).json({ message: result.message });
        }
        res.status(200).json({ message: "Producto eliminado del carrito", cart: result });
    } catch (error) {
        res.status(500).json({ message: "Error al borrar el producto del carrito" });
    }
};

export const deleteCart = async (req, res) => {
    const { cid } = req.params;
    try {
        const result = await cartsService.deleteCart(cid);
        if (!result) {
            return res.status(404).json({ message: "Carrito no encontrado" });
        }
        res.status(200).json({ message: "Carrito eliminado" });
    } catch (error) {
        res.status(500).json({ message: "Error al borrar el carrito" });
    }
};

export const getUserCart = async (req, res) => {
    try {
        const user = await userModel.findById(req.user.id).populate("cart");
        if (!user || !user.cart) {
            return res.status(404).json({ message: "Carrito no encontrado para el usuario" });
        }
        res.json(user.cart);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener el carrito del usuario" });
    }
};

export const finalizePurchase = async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await cartsModel.findById(cid).populate("products.productId");

        if (!cart || cart.products.length === 0) {
            return res.status(400).json({ success: false, message: "El carrito está vacío." });
        }

        let total = 0;
        const updatedProducts = [];

        for (let item of cart.products) {
            if (item.productId && item.productId.stock >= item.quantity) {
                total += item.productId.price * item.quantity;
                item.productId.stock -= item.quantity;
                await item.productId.save();
                updatedProducts.push(item);
            }
        }

        if (updatedProducts.length === 0) {
            return res.status(400).json({ success: false, message: "No hay stock disponible para los productos." });
        }

        const purchaserEmail = req.user?.email || req.body.email;
        if (!purchaserEmail) {
            return res.status(400).json({ success: false, message: "No se encontró el email del comprador." });
        }

        const newTicket = new ticketModel({
            code: uuidv4(),
            purchase_datetime: new Date(),
            amount: total,
            purchaser: purchaserEmail,
        });

        await newTicket.save();
        cart.products = [];
        await cart.save();

        res.json({
            success: true,
            message: "Compra realizada con éxito",
            ticketId: newTicket._id.toString(),
            redirectUrl: `/tickets/${newTicket._id.toString()}`
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error interno del servidor." });
    }
};
