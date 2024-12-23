import { Router } from "express";
import { cartsService } from "../services/carts.service.js";
import { productsService } from "../services/products.services.js";

export const cartsRouter = Router();

cartsRouter.post("/", async (req, res) => {
    try {
        const cart = await cartsService.create();
        if (!cart) {
            return res.status(404).json({ message: "Carrito no encontrado" });
        }
        res.status(201).json(cart);
    } catch (error) {
        res.status(500).json({ message: "Interrnal server error; Error al crear el carrito" });
    }
});

cartsRouter.get("/:cid", async (req, res) => {
    const { cid } = req.params;
    const cart = await cartsService.getById({ id: cid });
    if (!cart) {
        return res.status(404).json({ message: "Carrito no encontrado" });
    }
    res.status(200).json(cart.products);
});

cartsRouter.post("/:cid/product/:id", async (req, res) => {
    const { cid, id } = req.params;
    const { quantity = 1 } = req.body;

    const product = await productsService.getById({ id });
    if (!product) {
        return res.status(404).json({ message: "Producto no encontrado" });
    }

    try {
        const cart = await cartsService.addProduct({ cid, pid: id, quantity });
        if (!cart) {
            return res.status(404).json({ message: "Carrito no encontrado" });
        }

        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: "Error al agregar el producto al carrito" });
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
        res.status(500).json({ message: "Error al eliminar el producto del carrito" });
    }
});

cartsRouter.delete("/:cid", async (req, res) => {
    const { cid } = req.params;
    try {
        const cart = await cartsService.deleteCart({ cid });

        if (cart.message) {
            return res.status(404).json({ message: cart.message });
        }

        res.status(200).json(cart);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al borrar el carrito" });
    }
});