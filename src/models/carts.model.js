import { Schema, model } from "mongoose";
const cartsSchema = new Schema({
    products: [
        {
            productId: { type: Schema.Types.ObjectId, ref: 'Products', required: true },
            quantity: { type: Number, required: true }
        }
    ],
    totalPrice: { type: Number, default: 0 }
})

cartsSchema.methods.calculateTotalPrice = async function () {
    await this.populate('products.productId');
    this.totalPrice = this.products.reduce((acc, product) => {
        return acc + product.productId.price * product.quantity;
    }, 0);
    return this;

};
export const cartsModel = model('Carts', cartsSchema);