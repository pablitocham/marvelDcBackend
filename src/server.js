import express from "express";
import { productsRouter } from "./routes/products.router.js";
import { cartsRouter } from "./routes/carts.router.js";
import { productsService } from "./services/products.services.js";
import handlebars from "express-handlebars";
import { __dirname } from "./dirname.js";
import path from "path";
import { viewsRouter } from "./routes/views.routes.js";
import { Server } from "socket.io";

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.resolve(__dirname, "../public")));

app.engine("hbs", handlebars.engine({ defaultLayout: "main", extname: ".hbs" }));
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));


app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

const server = app.listen(PORT, () => {
  console.log(`Server runnig on http://localhost:${PORT}`);
})

export const io = new Server(server);

io.on("connection", async (socket) => {
  console.log("New client connected", socket.id);

  const realtimeProducts =await productsService.getAll();
  socket.emit("init", realtimeProducts);
})