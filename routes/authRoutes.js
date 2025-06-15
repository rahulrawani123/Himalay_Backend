const express = require("express");
const router = express.Router();
const { signup, login, AddProduct } = require("../controller/authController");
const upload = require("../middleware/upload");
const Product = require("../models/Product");

router.post("/api/signup", signup);
router.post("/api/login", login);
router.post("/api/addproduct", upload.single("image"), AddProduct);

module.exports = router;
