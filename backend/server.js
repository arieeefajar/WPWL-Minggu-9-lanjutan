// server.js (tambahkan endpoint POST)
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;
// Middleware
app.use(cors());
app.use(express.json());
// In-memory database
let products = [
  {
    id: 1,
    name: "Laptop",
    price: 15000000,
    category: "Electronics",
    stock: 10,
  },
  {
    id: 2,
    name: "Smartphone",
    price: 5000000,
    category: "Electronics",
    stock: 20,
  },
];
let nextId = 3;
// GET all products
app.get("/api/products", (req, res) => {
  setTimeout(() => {
    res.json({
      success: true,
      data: products,
      total: products.length,
    });
  }, 500);
});
// GET single product
app.get("/api/products/:id", (req, res) => {
  const product = products.find((p) => p.id === parseInt(req.params.id));
  if (!product) {
    return res.status(404).json({ success: false, error: "Product not found" });
  }
  res.json({ success: true, data: product });
});

// POST create new product
app.post("/api/products", (req, res) => {
  const { name, price, category, stock } = req.body;

  if (!name || !price || !category) {
    return res.status(400).json({
      success: false,
      error: "Name, price, and category are required",
    });
  }

  if (price <= 0) {
    return res.status(400).json({
      success: false,
      error: "Price must be greater than 0",
    });
  }

  const newProduct = {
    id: nextId++,
    name,
    price: parseInt(price),
    category,
    stock: parseInt(stock) || 0,
    createdAt: new Date(),
  };

  products.push(newProduct);
  setTimeout(() => {
    res.status(201).json({
      success: true,
      data: newProduct,
      message: "Product created successfully",
    });
  }, 800);
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

// PUT update product
app.put("/api/products/:id", (req, res) => {
  const product = products.find((p) => p.id === parseInt(req.params.id));
  if (!product) {
    return res.status(404).json({ success: false, error: "Product not found" });
  }

  const { name, price, category, stock } = req.body;

  // Validation
  if (price && price <= 0) {
    return res.status(400).json({
      success: false,
      error: "Price must be greater than 0",
    });
  }
  // Update product
  if (name) product.name = name;
  if (price) product.price = parseInt(price);
  if (category) product.category = category;
  if (stock) product.stock = parseInt(stock);
  product.updatedAt = new Date();
  setTimeout(() => {
    res.json({
      success: true,
      data: product,
      message: "Product updated successfully",
    });
  }, 600);
});

// DELETE Product
app.delete("/api/products/:id", (req, res) => {
  const productIndex = products.findIndex(
    (p) => p.id === parseInt(req.params.id),
  );

  if (productIndex === -1) {
    return res.status(404).json({ success: false, error: "Product not found" });
  }
  const deletedProduct = products.splice(productIndex, 1)[0];
  setTimeout(() => {
    res.json({
      success: true,
      data: deletedProduct,
      message: "Product deleted successfully",
    });
  }, 400);
});
