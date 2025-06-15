const User = require("../models/User");
const Product = require("../models/Product");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "123456123";

// Signup controller
exports.signup = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ msg: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    return res.status(201).json({ msg: "Signup successful" });
  } catch (err) {
    console.error("Signup error:", err.message);
    return res.status(500).json({ msg: "Server error" });
  }
};

// Login controller
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });

    return res.json({ token });
  } catch (err) {
    console.error("Login error:", err.message);
    return res.status(500).json({ msg: "Server error" });
  }
};

exports.AddProduct = async (req, res) => {
  try {
    console.log("📥 Incoming product add request...");

    // Log full request body and file (for debugging)
    console.log("Request body:", req.body);
    console.log("Request file:", req.file);

    const { name, desc } = req.body;

    // Check if image was uploaded
    if (!req.file || !req.file.path) {
      console.error("❌ Image file not uploaded");
      return res.status(400).json({ error: "Image is required" });
    }

    const image = req.file.path;

    const newProduct = new Product({ name, desc, image });
    await newProduct.save();

    console.log("✅ New product saved:", newProduct);

    res.status(201).json({ message: "Product added", product: newProduct });
  } catch (error) {
    console.error("🔥 Error in AddProduct:", error);
    res.status(500).json({ error: "Error adding product" });
  }
};

exports.getProductDetails = async (req, res) => {
  try {
    const products = await Product.find(); 
    res.status(200).json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching products", error });
  }
};

exports.EditProduct = async (req, res) => {
  try {
    const { name, desc } = req.body;
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ error: "Product not found" });

    // Update text fields
    product.name = name;
    product.desc = desc;

    // Handle image upload if a new one is provided
    if (req.file) {
      // Upload new image
      const result = await cloudinary.uploader.upload(req.file.path);
      product.image = result.secure_url;

      // Remove local temp file
      fs.unlinkSync(req.file.path);
    }

    await product.save();

    res.status(200).json({ message: "Product updated", product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error updating product" });
  }
};

exports.DeleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ error: "Product not found" });

    await Product.findByIdAndDelete(id);

    res.status(200).json({ message: "Product deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error deleting product" });
  }
};
