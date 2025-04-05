export class CartDTO {
    constructor(cart) {
        this.id = cart._id || cart.id;
        this.products = cart.products?.map(item => ({
            productId: item.productId?._id || item.productId,
            title: item.productId?.title || '',
            price: item.productId?.price || 0,
            quantity: item.quantity
        })) || [];
        this.totalPrice = cart.totalPrice || 0;
    }
}