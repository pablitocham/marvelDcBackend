
import express from "express";
import { productsRouter } from "./routes/products.router.js";
import { cartsRouter } from "./routes/carts.router.js";

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send(`<h1>Bienvenidos a Marvel Dc Funkos</h1>
   <h2> Ingresa a <a href="/api/products">Funkos</a> </h2>
  `)
})
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

app.listen(PORT, () => {
  console.log(`Server runnig on http://localhost:${PORT}`);
})