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
import { CONFIG } from "./config/config.js";
import passport from "passport";
import initializePassport from "./config/passport.js";
import cookieParser from "cookie-parser";
import { authRouter } from "./routes/auth.router.js";
import { adminRouter } from "./routes/admin.router.js";
const app = express();
const PORT = 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

initializePassport(passport);
app.use(passport.initialize());

;

app.use(express.static(path.resolve(__dirname, "../public")));

app.engine("hbs", handlebars.engine({ defaultLayout: "main", extname: ".hbs", handlebars: allowInsecurePrototypeAccess(Handlebars), helpers:{eq:(a,b) => a ===b} }));
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter)
app.use("/", viewsRouter);
app.use("/api/sessions", authRouter);
app.use("/api/admin", adminRouter);

const server = app.listen(PORT, () => {
  console.log(`Server runnig on http://localhost:${PORT}`);
})



if (CONFIG.PERSISTENCE === "mongodb") {
  mongoose
    .connect(CONFIG.MONGO_URI)
    .then(() => {
      console.log("Conectado a la base de datos");
    })
    .catch((error) => {
      console.log("Error al conectar a la base de datos", error);
    });
} else {
  console.log("Modo memoria: no se conecta a MongoDB");
}


export const io = new Server(server);

io.on("connection", async (socket) => {
  console.log("New client connected", socket.id);

  const realtimeProducts = await productsService.getAll();
  socket.emit("init", realtimeProducts);
})

