const express = require("express");
const mongoose = require("mongoose");
const Product = require("../models/Product");
const auth = require("../middleware/auth");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { search = "", category = "All", status = "Available" } = req.query;
    const filter = {};
    if (status !== "All") filter.status = status;
    if (category !== "All") filter.category = category;
    if (search.trim()) {
      filter.$or = [
        { title: { $regex: search.trim(), $options: "i" } },
        { description: { $regex: search.trim(), $options: "i" } }
      ];
    }
    const products = await Product.find(filter)
      .populate("seller", "name email")
      .sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Could not load products." });
  }
});

router.get("/my/listings", auth, async (req, res) => {
  try {
    const products = await Product.find({ seller: req.userId }).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Could not load your listings." });
  }
});

router.get("/:id", async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: "Invalid product ID." });
  const product = await Product.findById(req.params.id).populate("seller", "name email");
  if (!product) return res.status(404).json({ message: "Product not found." });
  res.json(product);
});

router.post("/", auth, async (req, res) => {
  try {
    const { title, description, price, category, condition, imageUrl, contact } = req.body;
    if (!title || !description || price === "" || price === undefined || !category || !condition || !contact) {
      return res.status(400).json({ message: "Please complete all required fields." });
    }
    const product = await Product.create({
      title, description, price: Number(price), category, condition,
      imageUrl: imageUrl || "", contact, seller: req.userId
    });
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message || "Could not create listing." });
  }
});

router.put("/:id", auth, async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: "Invalid product ID." });
    const product = await Product.findOne({ _id: req.params.id, seller: req.userId });
    if (!product) return res.status(404).json({ message: "Listing not found or you do not own it." });

    const fields = ["title", "description", "price", "category", "condition", "imageUrl", "contact", "status"];
    fields.forEach(field => {
      if (req.body[field] !== undefined) product[field] = field === "price" ? Number(req.body[field]) : req.body[field];
    });
    await product.save();
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: error.message || "Could not update listing." });
  }
});

router.delete("/:id", auth, async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: "Invalid product ID." });
  const product = await Product.findOneAndDelete({ _id: req.params.id, seller: req.userId });
  if (!product) return res.status(404).json({ message: "Listing not found or you do not own it." });
  res.json({ message: "Listing deleted." });
});

module.exports = router;
