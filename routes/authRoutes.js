const express = require("express");
const router = express.Router();
const { signup, login, AddProduct, getProductDetails, EditProduct, DeleteProduct, StoreEnquiries, getAllEnquiries, getProductDetail } = require("../controller/authController");
const upload = require("../middleware/Upload");

router.post("/api/signup", signup);
router.post("/api/login", login);
router.post("/api/addproduct", upload.single("image"), AddProduct);
router.get("/api/getproducts", getProductDetails);
router.put("/api/editproduct/:id",  upload.single("image"),  EditProduct);
router.delete("/api/deleteproduct/:id", DeleteProduct);
router.post("/api/storeenquiries", StoreEnquiries);
router.get("/api/getallenquiries", getAllEnquiries);
router.get("/api/getproduct/:id", getProductDetail);


module.exports = router;
