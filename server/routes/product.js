const express = require('express');
const productController = require("../controllers/product.js");
const { verify, verifyAdmin, isLoggedIn } = require("../auth.js");

// [SECTION] Routing Component
const router = express.Router();

// Create Product
router.post("/", verify, verifyAdmin, productController.createProduct);

// Retrieve all products
router.get("/all", verify, verifyAdmin, productController.retrieveAllProducts);

// Retrieve all active products
router.get("/active", productController.retrieveActiveProducts);

// Retrieve single product
router.get("/:productId", productController.retrieveSingleProduct);

// Update product info
router.patch("/:productId/update", verify, verifyAdmin, productController.updateProductInfo);

// Archive Product
router.patch("/:productId/archive", verify, verifyAdmin, productController.archiveProduct);

// Activate product
router.patch("/:productId/activate", verify, verifyAdmin, productController.activateProduct);

// Search for products by their name
router.post("/search-by-name", productController.searchProductsByName);

// Search for products by price range
router.post("/search-by-price", productController.searchProductsByPrice);

module.exports = router;