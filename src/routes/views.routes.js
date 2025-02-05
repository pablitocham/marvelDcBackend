import { Router } from "express";
import { productsService } from "../services/products.services.js";
export const viewsRouter = Router();
import { cartsService } from "../services/carts.service.js";


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

viewsRouter.get("/carts", async (req, res) => {
  try {
    const carts = await cartsService.getAll();
    if (carts.length === 0) {
      return res.render("carts", { title: "Carrito", cart: { items: [] } });
    }
    const cart = carts[0];
      
     res.render("carts", {title: "Carrito", cart: { items: cart.products.map(item => ({productId: {title: item.productId.title, price: item.productId.price}, quantity: item.quantity, totalPrice: item.productId.price * item.quantity}))}}); 
  } catch (error) {
    console.error("Error al obtener carrito:", error);
    res.status(500).send("Error interno del servidor");
  }
});

