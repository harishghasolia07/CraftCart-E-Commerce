const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 4000;
const FAKESTORE_BASE_URL = "https://fakestoreapi.com";

app.use(cors());

async function getJson(url) {
  const { default: got } = await import("got");
  const response = await got(url, { responseType: "json" });
  return response.body;
}

app.get("/api/products", async (req, res) => {
  try {
    const sort = req.query.sort || "asc";
    const data = await getJson(`${FAKESTORE_BASE_URL}/products?sort=${sort}`);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch products", error: error.message });
  }
});

app.get("/api/products/categories", async (_req, res) => {
  try {
    const data = await getJson(`${FAKESTORE_BASE_URL}/products/categories`);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch categories", error: error.message });
  }
});

app.get("/api/products/category/:category", async (req, res) => {
  try {
    const { category } = req.params;
    const sort = req.query.sort || "asc";
    const encodedCategory = encodeURIComponent(category);
    const data = await getJson(
      `${FAKESTORE_BASE_URL}/products/category/${encodedCategory}?sort=${sort}`
    );
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch category products", error: error.message });
  }
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`API server running on http://localhost:${PORT}`);
});
