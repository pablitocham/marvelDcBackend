import { Router } from "express";
import { cartsService } from "../services/carts.service.js";
import { productsService } from "../services/products.services.js";

export const cartsRouter = Router();

cartsRouter.get("/", async (req, res) => {
    try {
        const carts = await cartsService.getAll();
        res.status(200).json(carts);
    } catch (error) {
        res.status(500).json({ message: "internal server error" });
    }
});

cartsRouter.get("/:cid", async (req, res) => {
    const { cid } = req.params;
    try {
        const cart = await cartsService.getById({ id: Number(cid) });
        if (!cart) {
            return res.status(404).json({ message: "Carrito no encontrado" });
        }
        res.status(200).json(cart.products);
    } catch (error) {
        res.status(500).json({ message: "internal server error" });
    }
});

cartsRouter.post("/", async (req, res) => {
    try {
        const newCart = await cartsService.create();
        if (!newCart) {
            return res.status(404).json({ message: "Carrito no encontrado" });
        }
        res.status(201).json(newCart);
    } catch (error) {
        res.status(500).json({ message: "Interrnal server error; Error al crear el carrito" });
    }
});

cartsRouter.post("/:cid/product/:id", async (req, res) => {
    try {
        const { cid, id } = req.params;
        const { quantity = 1 } = req.body;
        if (!cid || !id) {
            return res.status(400).json({ message: "Faltan parámetros requeridos" });
        }

        const product = await productsService.getById({ id });

        if (!product) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }

        const cart = await cartsService.addProduct({ cid: Number(cid), pid: Number(id), quantity: Number(quantity) });

        if (!cart) {
            return res.status(404).json({ message: "Carrito no encontrado" });
        }

        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({
            message: "Error al agregar el producto al carrito", error: error.message
        });
    }
});

cartsRouter.delete("/:cid/product/:pid", async (req, res) => {
    const { cid, pid } = req.params;
    try {
        const cart = await cartsService.removeProduct({ cid, pid });

        if (cart.message) {
            return res.status(404).json({ message: cart.message });
        }

        res.status(200).json(cart);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al borrar el producto del carrito" });
    }
});

cartsRouter.delete("/:cid", async (req, res) => {
    const { cid } = req.params;
    try {
        const result = await cartsService.deleteCart({ cid });
        if (result.message) {
            return res.status(404).json({ message: result.message });
        }
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: "Error al borrar el carrito" });
    }
})