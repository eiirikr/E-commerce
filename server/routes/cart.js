const express = require('express');
const cartController = require('../controllers/cart.js');

const { verify, verifyAdmin, isLoggedIn } = require("../auth.js");

const router = express.Router();

// Retrieve User's Cart
router.get("/get-cart", verify, isLoggedIn, cartController.getUserCart);

// Add to Cart
router.post("/add-to-cart", verify, isLoggedIn, cartController.addToCart);

// Change Product Quantities in a Cart
router.patch("/update-cart-quantity", verify, isLoggedIn, cartController.updateCartQuantity)

// Remove Item from Cart
router.patch("/:productId/remove-from-cart", verify, isLoggedIn, cartController.removeFromCart)

// Clear Cart
router.put("/clear-cart", verify, isLoggedIn, cartController.clearCart)

module.exports = router;