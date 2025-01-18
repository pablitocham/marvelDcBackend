import fs from "node:fs"

class CartsService {
    path;
    carts = [];
    constructor({ path }) {
        this.path = path
        if (fs.existsSync(path)) {
            try {
                this.carts = JSON.parse(fs.readFileSync(this.path, "utf-8"))
            } catch (error) {
                this.carts = []
            }
        } else {
            this.carts = []
        }
    }

    async getAll() {
        return this.carts
    }

    async getById({ id }) {
        const cart = this.carts.find(cart => cart.id === Number(id))
        return cart
    }

    async create() {
        const lastCart = this.carts.length > 0 ? this.carts[this.carts.length - 1] : null;
        const id = lastCart ? Number(lastCart.id) + 1 : 1;
        const cart = { id, products: [] };
    
        this.carts.push(cart);
        try {
            await this.save();
            return cart;
        } catch (error) {
            throw new Error("Error al guardar el archivo del carrito");
        }
    }
    

    async addProduct({ cid, pid, quantity }) {
        try {
            const cart = this.carts.find(cart => cart.id === Number(cid));
            if (!cart) {
                console.log('No se encontró el carrito');
                return null;
            }

            const cleanPid = Number(pid.toString().trim());
            const existingProduct = cart.products.find(product => product.id === cleanPid);
            if (existingProduct) {
                existingProduct.quantity += Number(quantity);

            } else {
                const newProduct = {
                    id: cleanPid,
                    quantity: Number(quantity)
                };
                cart.products.push(newProduct);
            }

            await this.save();
            return cart;
        } catch (error) {
            throw new Error("Error al agregar el producto al carrito");
        }
    }

    async updateProduct({ cid, pid, quantity }) {
        const cart = this.carts.find(cart => cart.id === Number(cid));
        if (!cart) {
            return null;
        }

        const existingProduct = cart.products.find(product => product.id === Number(pid));
        if (existingProduct) {
            existingProduct.quantity = quantity;
        } else {
            return null;
        }

        try {
            await this.save();
            return cart;
        } catch (error) {
            throw new Error("Error al actualizar el producto del carrito");
        }
    }

    async removeProduct({ cid, pid }) {
        const cart = this.carts.find(cart => cart.id === Number(cid));
        if (!cart) {
            return { message: "Carrito no encontrado" };
        }

        const initialLength = cart.products.length;
        const cleanPid = Number(pid.toString().trim());
        cart.products = cart.products.filter(product => Number(product.id) !== cleanPid);

        if (cart.products.length === initialLength) {
            return { message: "Producto no encontrado en el carrito" };
        }

        try {
            await this.save();
            return cart;
        } catch (error) {
            throw new Error("Error al eliminar el producto del carrito");
        }
    }

    async deleteCart({ cid }) {
        const cartIndex = this.carts.findIndex(cart => cart.id === Number(cid));
        if (cartIndex === -1) {
            return { message: "Carrito no encontrado" };
        }

        this.carts.splice(cartIndex, 1);

        try {
            await this.save();
            return { message: "Carrito eliminado con éxito" };
        } catch (error) {
            throw new Error("Error al eliminar el carrito");
        }
    }
    async save() {
        try {
            await fs.promises.writeFile(this.path, JSON.stringify(this.carts, null, 2))
        } catch (error) {
            throw new Error("Error al guardar el archivo")
        }
    }
}
export const cartsService = new CartsService({ path: "./src/db/carts.json" })