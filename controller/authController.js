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
