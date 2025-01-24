const Order = require('../models/Order.js');
const Cart = require('../models/Cart.js');

const {errorHandler} = require("../auth.js");

// [SECTION] Create Order
module.exports.checkoutOrder = async (req, res) => {
  try {
    const userId = req.user.id;

    const cart = await Cart.findOne({ userId: userId });

    if (!cart) {
      return res.status(404).send({ error: 'No Items to Checkout' });
    }

    if (!cart.cartItems || cart.cartItems.length === 0) {
      return res.status(400).send({ error: 'No Items to Checkout' });
    }

    const newOrder = new Order({
      userId,
      productsOrdered: cart.cartItems.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        subtotal: item.subtotal,
      })),
      totalPrice: cart.totalPrice,
    });

    const savedOrder = await newOrder.save();

    return res.status(201).send({
      message: 'Ordered Successfully'
    });
  } catch (error){
    errorHandler(error, req, res);
  }
};

// [SECTION] Retrieve logged in user's orders
module.exports.getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;;

    const userOrders = await Order.find({ userId });

    if (!userOrders || userOrders.length === 0) {
      return res.status(404).send({ error: 'No orders found for this user.' });
    }

    return res.status(200).send({
      orders: userOrders
    });
  } catch (error){
    errorHandler(error, req, res);
  }
};

// [SECTION] Retrieve all user's orders
module.exports.getAllOrders = async (req, res) => {

  return Order.find({})
  .then(orders => {
    if(orders.length > 0){
      return res.status(200).send({orders: orders});
    } else{
      return res.status(404).send({error: 'An error occurred while retrieving all orders'});
    }
  })
  .catch(error => errorHandler(error, req, res));

};