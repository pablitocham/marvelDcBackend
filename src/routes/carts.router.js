import { Router } from "express";
import { cartsService } from "../services/carts.service.js";

export const cartsRouter = Router();

cartsRouter.get("/", async (req, res) => {
    try {
        const carts = await cartsService.getAll();
        res.status(200).json(carts);
    } catch (error) {
        res.status(500).json({ message: "Internal server error no de puedo obtener los carritos" });
    }
});

cartsRouter.get("/:cid", async (req, res) => {
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
});

cartsRouter.post("/", async (req, res) => {
    try {
        console.log("entro al post");
        const newCart = await cartsService.create();
        if (!newCart) return res.status(404).json({ message: "Error al crear el carrito" });
        res.status(201).json(newCart);
    } catch (error) {
        res.status(500).json({ message: "Error al crear el carrito" });
    }
});

cartsRouter.post("/:cid/product/:pid", async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;
        const updateCart = await cartsService.addProduct({ cid, pid, quantity });
        if (!updateCart) return res.status(404).json({ message: "Producto no encontrado" });
        res.status(200).json(updateCart);

    } catch (error) {
        res.status(500).json({
            message: "Error al agregar el producto al carrito", error: error.message
        });
    }
});

cartsRouter.put("/:cid/product/:pid", async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;
        const updateCart = await cartsService.updateProduct({ cid, pid, quantity });
        if (!updateCart) return res.status(404).json({ message: "Producto no encontrado" });
        res.status(200).json(updatedFunko);
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar la cantidad del producto del carrito", error: error.message });
    }
});

cartsRouter.delete("/:cid/product/:pid", async (req, res) => {
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
});

cartsRouter.delete("/:cid", async (req, res) => {
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
})

