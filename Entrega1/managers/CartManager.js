// managers/CartManager.js
import { Cart } from '../models/Cart.js';

export default class CartManager {
  async createCart() {
    const newCart = await Cart.create({ products: [] });
    return newCart;
  }

  async getCartById(id) {
    return await Cart.findById(id).populate('products.product');
  }

  async addProductToCart(cartId, productId, quantity = 1) {
    const cart = await Cart.findById(cartId);
    if (!cart) return null;

    const productInCart = cart.products.find(p => p.product.equals(productId));

    if (productInCart) {
      productInCart.quantity += quantity;
    } else {
      cart.products.push({ product: productId, quantity });
    }

    await cart.save();
    return await cart.populate('products.product');
  }

  async updateCart(cartId, productsArray) {
    const cart = await Cart.findById(cartId);
    if (!cart) return null;

    cart.products = productsArray.map(p => ({
      product: p.product,
      quantity: p.quantity,
    }));

    await cart.save();
    return await cart.populate('products.product');
  }

  async updateProductQuantity(cartId, productId, quantity) {
    const cart = await Cart.findById(cartId);
    if (!cart) return null;

    const productInCart = cart.products.find(p => p.product.equals(productId));
    if (!productInCart) return null;

    productInCart.quantity = quantity;
    await cart.save();
    return await cart.populate('products.product');
  }

  async deleteProduct(cartId, productId) {
    const cart = await Cart.findById(cartId);
    if (!cart) return null;

    cart.products = cart.products.filter(p => !p.product.equals(productId));
    await cart.save();
    return cart;
  }

  async clearCart(cartId) {
    const cart = await Cart.findById(cartId);
    if (!cart) return null;

    cart.products = [];
    await cart.save();
    return cart;
  }
}
