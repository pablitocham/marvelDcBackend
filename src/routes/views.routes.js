import { Router } from "express";
import { productsService } from "../services/products.services.js";
export const viewsRouter = Router();
import { cartsService } from "../services/carts.service.js";
import passport from "passport";

viewsRouter.get("/register", (req, res) => {
  res.render("register", { title: "Registrarse" });
})

viewsRouter.get("/login", (req, res) => {
  res.render("login", { title: "Iniciar sesión" });
})

viewsRouter.get("/profile", passport.authenticate("jwt", { session: false }), (req, res) => {
  res.render("profile", { title: "Perfil", user: req.user });
})

viewsRouter.get("/logout", (req, res) => {
  res.clearCookie("token").redirect("/login");
})

viewsRouter.get("/", (req, res) => {
  try {
    if (!req.cookies?.token) {
      return res.redirect("/login")
    }
    res.redirect("/home")
  } catch (error) {
    res.status(500).send("Error en el servidor");
  }
})

viewsRouter.get("/home", passport.authenticate("jwt", { session: false }), async (req, res) => {
  try {
    const allProducts = await productsService.getAll();
    res.render("home", { title: "Inicio", products: allProducts, user: req.user });
  } catch (error) {
    res.status(500).send("Servidor fallando");
  }
})

viewsRouter.get("/realtimeproducts", passport.authenticate("jwt", { session: false }), async (req, res) => {
  try {
    const allProducts = await productsService.getAll();
    res.render("realTimeProducts", { title: "Crear Funko", products: allProducts, user: req.user });
  } catch (error) {
    res.status(500).send("Servidor fallando");
  }
})

viewsRouter.get("/carts", passport.authenticate("jwt", { session: false }), async (req, res) => {
  try {
    const cart = await cartsService.getById(req.user.cart);
    if (!cart) {
      return res.render("carts", { title: "carrito", cart: { items: [] }, user: req.user });
    }
    res.render("carts", { title: "carrito", cart: { items: cart.products.map(item => ({ productId: { title: item.productId.title, price: item.productId.price }, quantity: item.quantity, totalPrice: item.productId.price * item.quantity })) }, user: req.user });
  } catch (error) {
    res.status(500).send("Servidor fallando");
  }
})

