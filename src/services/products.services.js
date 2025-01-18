import fs from "node:fs"

class ProductsService {
    path;
    products = []

    constructor({ path }) {
        this.path = path

        if (fs.existsSync(path)) {
            try {
                this.products = JSON.parse(fs.readFileSync(this.path, "utf-8"))
            } catch (error) {
                this.products = []
            }
        } else {
            this.products = []
        }
    }

    async getAll() {
        return this.products
    }

    async getById({ id }) {
        const product = this.products.find(product => product.id === Number(id))
        return product
    }

    async create({ title, description, code, price, stock, category }) {

        const lastId = this.products.length > 0
            ? Math.max(...this.products.map(product => product.id))
            : 0;
        const product = {
            id: lastId + 1, 
            title,
            description,
            code,
            price,
            stock,
            category,
        };

        this.products.push(product);

        try {
            await this.save();
            return product;
        } catch (error) {
            throw new Error("Error al guardar el archivo");
        }
    }

    async update({ id, title, description, code, price, stock, category }) {
        const product = this.products.find(product => product.id === Number(id))
        if (!product) {
            return null
        }
        product.title = title ?? product.title
        product.description = description ?? product.description
        product.code = code ?? product.code
        product.price = price ?? product.price
        product.stock = stock ?? product.stock
        product.category = category ?? product.category

        try {
            await this.save()
            return product
        } catch (error) {
            throw new Error("Error al actualizar el producto")
        }
    }

    async delete({ id }) {
        const product = this.products.find(product => product.id === Number(id))
        if (!product) {
            return null
        }
        const index = this.products.findIndex(product => product.id === Number(id))

        this.products.splice(index, 1)

        try {
            await this.save()
            return product
        } catch (error) {
            throw new Error("Error al querer borrar")
        }
    }

    async save() {
        try {
            await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, 2))
        } catch (error) {
            throw new Error("Error al guardar el archivo")
        }
    }
}
export const productsService = new ProductsService({ path: "./src/db/products.json" })