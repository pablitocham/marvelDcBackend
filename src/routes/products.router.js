import { Router } from "express";
import { productsService } from "../services/products.services.js";
export const productsRouter = Router();
import { io } from "../server.js";

productsRouter.get("/", async (req, res) => {
    try {
        const products = await productsService.getAll();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
})

productsRouter.get("/:id", async (req, res) => {
    const { id } = req.params;
    const product = await productsService.getById({ id });
    if (!product) {
        return res.status(404).json({ message: "Producto no encontrado" });
    }
    res.status(200).json(product);
})

productsRouter.post("/", async (req, res) => {
    const { title, description, code, price, stock, category } = req.body;
    if (!title || !description || !code || !price || !stock || !category) {
        return res.status(400).json({ message: "Para crear debe hacerlos con todos los datos requeridos" });
    }
    try {
        const product = await productsService.create({ title, description, code, price, stock, category });
        const productWithoutImage = { ...product, image: null };
        io.emit("new-funko", productWithoutImage);
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

productsRouter.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { title, description, code, price, stock, category } = req.body;
    if (!id || isNaN(id)) {
        return res.status(400).json({ message: "Id invalido" })
    }
    try {
        const product = await productsService.update({ id, title, description, code, price, stock, category });
        if (!product) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
})

productsRouter.delete("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const product = await productsService.delete({ id });
        if (!product) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }
        res.status(204).end()
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
})

