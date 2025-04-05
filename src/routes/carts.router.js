import { Router } from "express";
import { finalizePurchase } from "../controllers/carts.controller.js";
import { passportCall } from "../middleware/passport.middleware.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
    getAllCarts,
    getCartById,
    createCart,
    addProductToCart,
    updateProductInCart,
    removeProductFromCart,
    deleteCart,
} from "../controllers/carts.controller.js";

export const cartsRouter = Router();

cartsRouter.get("/", getAllCarts);
cartsRouter.get("/:cid", getCartById);
cartsRouter.post("/", createCart);
cartsRouter.post("/:cid/product/:pid", addProductToCart);
cartsRouter.get("/api/mycart", passportCall("jwt"), authMiddleware, (req, res) => {
    res.json({ cart: req.user.cart });
});
cartsRouter.post("/:cid/purchase", passportCall("jwt"), finalizePurchase);

cartsRouter.put("/:cid/product/:pid", updateProductInCart);
cartsRouter.delete("/:cid/product/:pid", removeProductFromCart);

cartsRouter.delete("/:cid", deleteCart);
