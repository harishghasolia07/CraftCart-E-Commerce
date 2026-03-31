import { makeAutoObservable } from "mobx";

export class CartStore {
  items = []; // Array of { product, quantity }

  constructor(rootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
    this.loadCart();
  }

  addToCart(product) {
    const existing = this.items.find(item => item.product.id === product.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      this.items.push({ product, quantity: 1 });
    }
    this.saveCart();
  }

  // Requirement: "Don'tEnable users to remove items from the cart."
  // So no remove from cart method!

  get totalValue() {
    return this.items.reduce((total, item) => total + item.product.price * item.quantity, 0).toFixed(2);
  }

  get totalItems() {
    return this.items.reduce((total, item) => total + item.quantity, 0);
  }

  saveCart() {
    // "Bonus Points: Implement a feature to persist the cart state usingsession localStorage"
    try {
      localStorage.setItem('ecommerce_cart', JSON.stringify(this.items));
    } catch (e) {
      console.error(e);
    }
  }

  loadCart() {
    try {
      const data = localStorage.getItem('ecommerce_cart');
      if (data) {
        this.items = JSON.parse(data);
      }
    } catch (e) {
      console.error(e);
    }
  }
}
