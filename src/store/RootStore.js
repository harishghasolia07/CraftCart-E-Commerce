import { ProductStore } from './ProductStore';
import { CartStore } from './CartStore';
import { UiStore } from './UiStore';

export class RootStore {
  constructor() {
    this.uiStore = new UiStore(this);
    this.productStore = new ProductStore(this);
    this.cartStore = new CartStore(this);
  }
}
