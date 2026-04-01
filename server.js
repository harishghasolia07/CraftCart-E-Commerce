const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 4000;
const FAKESTORE_BASE_URL = "https://fakestoreapi.com";
const DUMMYJSON_BASE_URL = "https://dummyjson.com";

app.use(cors());

async function getJson(url) {
  const { default: got } = await import("got");
  const response = await got(url, { responseType: "json" });
  return response.body;
}

function normalizeDummyProduct(product) {
  return {
    id: product.id,
    title: product.title,
    price: Number(product.price),
    description: product.description,
    category: product.category,
    image: product.thumbnail
  };
}

function sortById(items, sort = "asc") {
  const sorted = [...items].sort((a, b) => a.id - b.id);
  return sort === "desc" ? sorted.reverse() : sorted;
}

async function getProductsWithFallback(sort = "asc") {
  try {
    const data = await getJson(`${FAKESTORE_BASE_URL}/products?sort=${sort}`);
    return data;
  } catch (_error) {
    const fallback = await getJson(`${DUMMYJSON_BASE_URL}/products?limit=194`);
    const normalized = (fallback.products || []).map(normalizeDummyProduct);
    return sortById(normalized, sort);
  }
}

async function getCategoriesWithFallback() {
  try {
    const data = await getJson(`${FAKESTORE_BASE_URL}/products/categories`);
    return data;
  } catch (_error) {
    const fallback = await getJson(`${DUMMYJSON_BASE_URL}/products/categories`);
    if (Array.isArray(fallback)) {
      return fallback.map((entry) => (typeof entry === "string" ? entry : entry.slug || entry.name));
    }
    return [];
  }
}

async function getCategoryProductsWithFallback(category, sort = "asc") {
  try {
    const encodedCategory = encodeURIComponent(category);
    const data = await getJson(`${FAKESTORE_BASE_URL}/products/category/${encodedCategory}?sort=${sort}`);
    return data;
  } catch (_error) {
    const encodedCategory = encodeURIComponent(category);
    const fallback = await getJson(`${DUMMYJSON_BASE_URL}/products/category/${encodedCategory}?limit=194`);
    const normalized = (fallback.products || []).map(normalizeDummyProduct);
    return sortById(normalized, sort);
  }
}

app.get("/api/products", async (req, res) => {
  try {
    const sort = req.query.sort || "asc";
    const data = await getProductsWithFallback(sort);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch products", error: error.message });
  }
});

app.get("/api/products/categories", async (_req, res) => {
  try {
    const data = await getCategoriesWithFallback();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch categories", error: error.message });
  }
});

app.get("/api/products/category/:category", async (req, res) => {
  try {
    const { category } = req.params;
    const sort = req.query.sort || "asc";
    const data = await getCategoryProductsWithFallback(category, sort);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch category products", error: error.message });
  }
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`API server running on http://localhost:${PORT}`);
});
