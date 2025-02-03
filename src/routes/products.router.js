import { Router } from "express";
import { productsModel } from "../models/products.model.js";
export const productsRouter = Router();
import { io } from "../server.js";
import mongoose from "mongoose";


productsRouter.get("/", async (req, res) => {
    try {
        const products = await productsModel.find();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: "Internal server error al solicitar los productos" });

    }
})

productsRouter.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({ message: "Id invalido" });
        }
        const product = await productsModel.findById(id);
        if (!product) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }
        res.status(200).json(product);
    } catch (error) {
        console.error(error);
        throw new Error("Internal server error al solicitar el producto");
    }
})

productsRouter.post("/", async (req, res) => {
    const { title, description, code, price, stock, category, status } = req.body;
    if (!title || !description || !code || !price || !stock || !category) {
        return res.status(400).json({ message: "Para crear debe hacerlos con todos los datos requeridos" });
    }
    try {
        const newproduct = new productsModel({ title, description, code, price, stock, category, status: status !== undefined ? status : true });
        const savedProduct = await newproduct.save();
        //const productWithoutImage = { ...savedProduct.toObject(), image: null };

        io.emit("new-funko", savedProduct);
        res.status(201).json(savedProduct);
    } catch (error) {
        res.status(500).json({ message: "Internal server error y no se por que" });
    }
});

productsRouter.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { title, description, code, price, stock, category } = req.body;
    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ message: "Id invalido" })
    }
    try {
        const product = await productsModel.findByIdAndUpdate(id, { title, description, code, price, stock, category, new: true });
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
        const product = await productsModel.findByIdAndDelete(id);
        if (!product) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }
        res.status(204).end()
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
})

