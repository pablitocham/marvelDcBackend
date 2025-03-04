import express from "express";
import { productsRouter } from "./routes/products.router.js";
import { cartsRouter } from "./routes/carts.router.js";
import handlebars from "express-handlebars";
import { __dirname } from "./dirname.js";
import path from "path";
import { viewsRouter } from "./routes/views.routes.js";
import { Server } from "socket.io";
import mongoose from "mongoose";
import Handlebars from "handlebars";
import { allowInsecurePrototypeAccess } from "@handlebars/allow-prototype-access";
import { productsService } from "./services/products.services.js";

import passport from "passport";
import initializePassport from "./config/passport.js";
import cookieParser from "cookie-parser";
import { routerUser } from "./routes/auth.routes.js";
const app = express();
const PORT = 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

initializePassport(passport);
app.use(passport.initialize());


app.use(express.static(path.resolve(__dirname, "../public")));

app.engine("hbs", handlebars.engine({ defaultLayout: "main", extname: ".hbs", handlebars: allowInsecurePrototypeAccess(Handlebars) }));
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter)
app.use("/", viewsRouter);
app.use("/api/sessions", routerUser);

const server = app.listen(PORT, () => {
  console.log(`Server runnig on http://localhost:${PORT}`);
})

mongoose.connect("insertar url de mongo que deje en el comentario de la entrega" )
  .then(() => {
    console.log("Conectado a la base de datos");
  })
  .catch((error) => {
    console.log("Error al conectar a la base de datos", error);
  })


export const io = new Server(server);

io.on("connection", async (socket) => {
  console.log("New client connected", socket.id);

  const realtimeProducts = await productsService.getAll();
  socket.emit("init", realtimeProducts);
})

