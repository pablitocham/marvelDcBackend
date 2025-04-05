export class CartMemoryDAO {
    constructor() {
        this.carts = [];
        this.currentId = 0;
    }

    createCart() {
        const newCart = { id: this.currentId++, products: [] };
        this.carts.push(newCart);
        return newCart;
    }

    getCarts() {
        return this.carts;
    }

    getCartById(id) {
        return this.carts.find(cart => cart.id === id);
    }

    addProductToCart(cartId, product) {
        const cart = this.getCartById(cartId);
        if (!cart) return null;

        const productIndex = cart.products.findIndex(p => p.productId === product.id);
        if (productIndex === -1) {
            cart.products.push({ productId: product.id, quantity: 1 });
        } else {
            cart.products[productIndex].quantity += 1;
        }
        return cart;
    }

    updateProductInCart(cartId, productId, quantity) {
        const cart = this.getCartById(cartId);
        if (!cart) return null;

        const productIndex = cart.products.findIndex(p => p.productId === productId);
        if (productIndex !== -1) {
            cart.products[productIndex].quantity = quantity;
        }
        return cart;
    }

    removeProductFromCart(cartId, productId) {
        const cart = this.getCartById(cartId);
        if (!cart) return null;

        cart.products = cart.products.filter(p => p.productId !== productId);
        return cart;
    }

    deleteCart(cartId) {
        const index = this.carts.findIndex(cart => cart.id === cartId);
        if (index !== -1) {
            this.carts.splice(index, 1);
            return true;
        }
        return false;
    }
}
