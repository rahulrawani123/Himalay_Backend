const User = require("../models/User");
const Product = require("../models/Product");
const Enquiry = require("../models/Enquiry");
const Blog = require("../models/Blog");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cloudinary = require("../config/cloudinaryConfig");

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

    const { name, desc, category } = req.body;

    // Check if image was uploaded
    if (!req.file || !req.file.path) {
      return res.status(400).json({ error: "Image is required" });
    }

    const image = req.file.path;

    const newProduct = new Product({ name, desc, image, category });
    await newProduct.save();

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
    const { name, desc, category } = req.body;
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ error: "Product not found" });

    // Update text fields
    product.name = name;
    product.desc = desc;
    product.category = category;

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

exports.StoreEnquiries = async (req, res) => {
  try {
    const enquiry = new Enquiry(req.body);
    await enquiry.save();
    res.status(201).json({ success: true, message: "Enquiry submitted!" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Submission failed", error });
  }
};

exports.getAllEnquiries = async (req, res) => {
  try {
    const enquiries = await Enquiry.find().sort({ createdAt: -1 });
    res.status(200).json(enquiries);
  } catch (error) {
    res.status(500).json({ message: "Error fetching enquiries", error });
  }
};

exports.getProductDetail = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.status(200).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching product", error });
  }
};

exports.postBlogData = async (req, res) => {
  try {
    const {
      title,
      writer,
      writerPosition,
      date,
      description1,
      description2Title,
      description2,
      description3Title,
      description3,
      description4Title,
      description4,
      description5Title,
      description5,
    } = req.body;

    // Upload images to Cloudinary and get secure_url
    const writerPhotoResult = req.files.writerPhoto
      ? await cloudinary.uploader.upload(req.files.writerPhoto[0].path, {
          folder: "Himalay_Blogs",
        })
      : null;

    const mainPhotoResult = req.files.photo
      ? await cloudinary.uploader.upload(req.files.photo[0].path, {
          folder: "Himalay_Blogs",
        })
      : null;

    const desc2ImageResult = req.files.description2Image
      ? await cloudinary.uploader.upload(req.files.description2Image[0].path, {
          folder: "Himalay_Blogs",
        })
      : null;

    // Save blog to MongoDB
    const newBlog = new Blog({
      title,
      writer,
      writerPosition,
      writerPhoto: writerPhotoResult?.secure_url || "",
      date,
      photo: mainPhotoResult?.secure_url || "",
      description1,
      description2Title,
      description2Image: desc2ImageResult?.secure_url || "",
      description2,
      description3Title,
      description3,
      description4Title,
      description4,
      description5Title,
      description5,
    });

    await newBlog.save();

    res.status(201).json({
      message: "✅ Blog created successfully!",
      blog: newBlog,
    });
  } catch (error) {
    console.error("❌ Error in postBlogData:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getBlogData = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ date: -1 });
    res.status(200).json(blogs);
  } catch (err) {
    console.error("Error fetching blogs:", err);
    res.status(500).json({ message: "Error fetching blogs" });
  }
};

exports.getBlogDataDetail = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

