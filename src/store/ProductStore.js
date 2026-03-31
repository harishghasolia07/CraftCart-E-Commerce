import { makeAutoObservable, runInAction } from "mobx";

export class ProductStore {
  products = [];
  categories = [];
  selectedCategory = "";
  sortOrder = "asc"; // FakeStore API supports asc, desc
  isLoading = false;
  error = null;

  constructor(rootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
  }

  async fetchFromApi(url) {
    const res = await fetch(url);
    if (!res.ok) throw new Error("API request failed");
    return await res.json();
  }

  async fetchCategories() {
    this.isLoading = true;
    try {
      const data = await this.fetchFromApi("https://fakestoreapi.com/products/categories");
      runInAction(() => {
        this.categories = data;
        this.error = null;
        this.isLoading = false;
      });
    } catch (err) {
      runInAction(() => {
        this.error = err.message;
        this.isLoading = false;
      });
    }
  }

  async fetchProducts() {
    this.isLoading = true;
    let url = "https://fakestoreapi.com/products";
    
    // Per requirements: don't filter locally, always call the APIs
    // Only one category at a time
    if (this.selectedCategory) {
      url += `/category/${this.selectedCategory}`;
    }
    
    // Sort parameter
    url += `?sort=${this.sortOrder}`;

    try {
      const data = await this.fetchFromApi(url);
      runInAction(() => {
        this.products = data;
        this.error = null;
        this.isLoading = false;
      });
    } catch (err) {
      runInAction(() => {
        this.error = err.message;
        this.isLoading = false;
      });
    }
  }

  setCategory(category) {
    this.selectedCategory = category;
    this.fetchProducts();
  }

  setSortOrder(order) {
    this.sortOrder = order;
    this.fetchProducts();
  }
}
