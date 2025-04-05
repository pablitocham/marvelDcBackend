export class ProductMemoryDAO {
    constructor() {
        this.products = [];
        this.currentId = 0;
    }

    createProduct({ title, description, code, price, status, stock, category }) {
        const newProduct = { id: this.currentId++, title, description, code, price, status, stock, category };
        this.products.push(newProduct);
        return newProduct;
    }

    getProducts() {
        return this.products;
    }

    getProductById(id) {
        return this.products.find(product => product.id === id);
    }

    updateProduct(id, { title, description, code, price, status, stock, category }) {
        const product = this.getProductById(id);
        if (!product) return null;

        product.title = title;
        product.description = description;
        product.code = code;
        product.price = price;
        product.status = status;
        product.stock = stock;
        product.category = category;

        return product;
    }

    deleteProduct(id) {
        const index = this.products.findIndex(product => product.id === id);
        if (index !== -1) {
            this.products.splice(index, 1);
            return true;
        }
        return false;
    }

    getPaginate({ page = 1, limit = 10 }) {
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        const paginatedProducts = this.products.slice(startIndex, endIndex);
        return {
            total: this.products.length,
            page,
            limit,
            docs: paginatedProducts
        };
    }
}
