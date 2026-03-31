import { makeAutoObservable, runInAction } from "mobx";

export class ProductStore {
  products = [];
  categories = [];
  selectedCategories = [];
  sortOrder = "asc"; // FakeStore API supports asc, desc
  isLoading = false;
  error = null;

  constructor(rootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
  }

  get apiBaseUrl() {
    return process.env.REACT_APP_API_BASE_URL || "http://localhost:4000";
  }

  async fetchFromApi(url) {
    const res = await fetch(url);
    if (!res.ok) throw new Error("API request failed");
    return await res.json();
  }

  async fetchCategories() {
    this.isLoading = true;
    try {
      const data = await this.fetchFromApi(`${this.apiBaseUrl}/api/products/categories`);
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
    try {
      let data = [];

      // Per requirements: don't filter locally, always call APIs.
      // For multiple selected categories, call each category endpoint and merge.
      if (this.selectedCategories.length > 0) {
        const categoryRequests = this.selectedCategories.map((category) =>
          this.fetchFromApi(
            `${this.apiBaseUrl}/api/products/category/${encodeURIComponent(category)}?sort=${this.sortOrder}`
          )
        );
        const categoryResults = await Promise.all(categoryRequests);
        data = categoryResults.flat();
      } else {
        data = await this.fetchFromApi(
          `${this.apiBaseUrl}/api/products?sort=${this.sortOrder}`
        );
      }

      // Remove duplicates defensively when combining multi-category responses.
      const uniqueData = Array.from(new Map(data.map((item) => [item.id, item])).values());

      runInAction(() => {
        this.products = uniqueData;
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
    if (this.selectedCategories.includes(category)) {
      this.selectedCategories = this.selectedCategories.filter((c) => c !== category);
    } else {
      this.selectedCategories = [...this.selectedCategories, category];
    }
    this.fetchProducts();
  }

  clearCategories() {
    this.selectedCategories = [];
    this.fetchProducts();
  }

  setSortOrder(order) {
    this.sortOrder = order;
    this.fetchProducts();
  }
}
