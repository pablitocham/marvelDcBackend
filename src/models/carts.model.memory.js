const carts = [];

export const cartsModel = {
  create: async (cartData) => {
    const cart = { ...cartData, id: Date.now().toString(), products: [] };
    carts.push(cart);
    return cart;
  }
};
