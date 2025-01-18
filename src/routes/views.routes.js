import { Router } from "express";
import { productsService } from "../services/products.services.js";
export const viewsRouter = Router();

viewsRouter.get("/", async (req, res) => {
  try {
    const allProducts = await productsService.getAll();
    res.render("home", { title: "Inicio", products: allProducts });
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.status(500).send("Interval server error");
  }
})

viewsRouter.get("/realtimeproducts", async (req, res) => {
  try {
    const allProducts = await productsService.getAll();
    res.render("realTimeProducts", { title: "Crear Funko", products: allProducts });
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.status(500).send("Interval server error");
  }
});

