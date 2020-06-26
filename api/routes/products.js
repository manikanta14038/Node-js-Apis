const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require("multer");
//  const upload=multer({dest:'uploads/'});
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png")
    cb(null, true);
  else cb(null, false);
};
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
});

const Product = require("../models/products");
const checkAuth = require("../middleware/checkAuth");
const productControllers = require("../controllers/products");

router.get("/", productControllers.get_all_products);

router.post(
  "/",
  checkAuth,
  upload.single("productImage"),
  productControllers.post_a_product
);

router.get("/:productId", productControllers.get_product);

router.patch("/:productId", checkAuth, productControllers.change_product);

router.delete("/:productId", checkAuth, productControllers.delete_product);

module.exports = router;
