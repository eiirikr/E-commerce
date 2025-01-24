const express = require('express');
const orderController = require("../controllers/order.js");
const { verify, verifyAdmin, isLoggedIn } = require("../auth.js");

// [SECTION] Routing Component
const router = express.Router();

// Create Order
router.post('/checkout', verify, orderController.checkoutOrder);

// Retrieve logged in user's orders
router.get('/my-orders', verify, orderController.getUserOrders);

// Retrieve all user's orders
router.get('/all-orders', verify, verifyAdmin, orderController.getAllOrders);

module.exports = router;