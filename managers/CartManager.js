import CartModel from "../models/Carts.js";

export default class CartManager {
  // Obtener carrito por ID
  async getCartById(cid) {
    return await CartModel.findById(cid).populate("products.product").lean();
  }

  // Crear un carrito nuevo
  async createCart() {
    const cart = new CartModel({ products: [] });
    return await cart.save();
  }

  // Agregar un producto al carrito
  async addProduct(cid, pid, quantity = 1) {
    const cart = await CartModel.findById(cid);
    if (!cart) throw new Error("Carrito no encontrado");

    const productIndex = cart.products.findIndex(p => p.product.equals(pid));
    if (productIndex !== -1) {
      cart.products[productIndex].quantity += quantity;
    } else {
      cart.products.push({ product: pid, quantity });
    }

    return await cart.save();
  }

  // Eliminar un producto del carrito
  async deleteProduct(cid, pid) {
    const cart = await CartModel.findById(cid);
    if (!cart) throw new Error("Carrito no encontrado");

    cart.products = cart.products.filter(p => !p.product.equals(pid));
    return await cart.save();
  }

  // Actualizar la cantidad de un producto
  async updateProductQuantity(cid, pid, quantity) {
    const cart = await CartModel.findById(cid);
    if (!cart) throw new Error("Carrito no encontrado");

    const product = cart.products.find(p => p.product.equals(pid));
    if (!product) throw new Error("Producto no encontrado en el carrito");

    product.quantity = quantity;
    return await cart.save();
  }

  // Reemplazar todos los productos del carrito
  async updateCartProducts(cid, newProducts) {
    const cart = await CartModel.findById(cid);
    if (!cart) throw new Error("Carrito no encontrado");

    cart.products = newProducts.map(p => ({
      product: p.productId,
      quantity: p.quantity,
    }));

    return await cart.save();
  }

  // Vaciar carrito
  async clearCart(cid) {
    const cart = await CartModel.findById(cid);
    if (!cart) throw new Error("Carrito no encontrado");

    cart.products = [];
    return await cart.save();
  }
}
