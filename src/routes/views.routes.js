import { Router } from "express";
import { productsService } from "../services/products.services.js";
export const viewsRouter = Router();
import { cartsService } from "../services/carts.service.js";
import { ticketModel } from "../models/ticket.model.js";
import passport from "passport";
import { isAdmin } from "../middleware/admin.middleware.js";


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


viewsRouter.get("/tickets/:tid", async (req, res) => {
  console.log("Parámetro recibido en la URL:", req.params.tid);

  if (!req.params.tid || req.params.tid === "undefined") {
    return res.status(400).send("ID del ticket no válido");
  }

  try {
    const ticket = await ticketModel.findById(req.params.tid).lean();
    console.log("Ticket obtenido desde la base de datos:", ticket);

    if (!ticket) {
      return res.status(404).send("Ticket no encontrado");
    }

    const formattedDate = new Date(ticket.purchase_datetime).toLocaleString();

    res.render("ticket", {
      title: "Ticket de Compra",
      ticket: {
        ...ticket,
        date: formattedDate
      }
    });

  } catch (error) {
    console.error("Error en la consulta:", error);
    res.status(500).send("Error en el servidor");
  }
});

viewsRouter.get("/admin",
  passport.authenticate("jwt", { session: false }),
  isAdmin,
  async (req, res) => {
    try {
      const allProducts = await productsService.getAll();
      res.render("admin", { title: "Panel de Administración", products: allProducts, user: req.user });
    } catch (error) {
      console.error("Error al cargar el panel de administrador:", error);
      res.status(500).send("Error al cargar la vista de administrador");
    }
  });