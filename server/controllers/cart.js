const Cart = require('../models/Cart.js');
const Item = require('../models/Product.js')

const {errorHandler} = require("../auth.js");

// [SECTION] Retrieve user cart
module.exports.getUserCart = async (req, res) => {
  try{
    const userId = req.user.id
    const userCart = await Cart.findOne({userId: userId});
    // console.log(req.user.id);

    if (!userCart) {
      return res.status(404).send({
        message: 'Cart is empty'
      })
    } else {
      return res.status(200).send({
        cart : userCart
      })
    }
  }
  catch (error){
    errorHandler(error, req, res);
  }
};

// [SECTION] Add to cart
module.exports.addToCart = async (req, res) => {
  try{
    const { productId, quantity, subtotal } = req.body;
    const userId = req.user.id;

    let userCart = await Cart.findOne({userId});
    // console.log(req.user.id);

    if(!userCart){
      userCart = new Cart({
        userId: userId,
        cartItems: [{ productId, quantity, subtotal}],
        totalPrice: subtotal
      })
      await userCart.save();
      return res.status(201).send({
        message: 'Item added to cart successfully',
        cart: userCart
      })
    }

    else {
      const existingProduct = userCart.cartItems.findIndex(item => item.productId === productId);
      // console.log(existingProduct);

      if (existingProduct > -1) {
        // Update quantity and subtotal if product already exists
        userCart.cartItems[existingProduct].quantity += quantity;
        userCart.cartItems[existingProduct].subtotal += subtotal;
      } else {
        // Add new product to cartItems if it does not exist
        userCart.cartItems.push({ productId, quantity, subtotal });
      }

      // Update the total price
      userCart.totalPrice = userCart.cartItems.reduce((total, item) => total + item.subtotal, 0);

      await userCart.save();
      return res.status(200).send({
        message: 'Cart updated successfully',
        cart: userCart
      });
    }
  }
  catch (error) {
    errorHandler(error, req, res);
  }
};

// [SECTION] Update cart quantity
module.exports.updateCartQuantity = async (req, res) => {
  try{
    const userId = req.user.id
    const { productId, newQuantity } = req.body;

    const updatedCart = await Cart.findOneAndUpdate({userId, "cartItems.productId": productId},
      {
        $set: {
          "cartItems.$.quantity": newQuantity,
        }
      },
      {new: true}
    );

    if (!updatedCart) {
      return res.status(404).send({ message: "Item not found in the cart" });
    }

    const item = await Item.findById(req.body.productId);
    if (!item) {
      return res.status(404).send({ message: "Product not found" });
    }
    const itemPrice = item.price;

    // Update subtotal for the specific product
    const productIndex = updatedCart.cartItems.findIndex(item => item.productId === productId);
    updatedCart.cartItems[productIndex].subtotal = newQuantity * itemPrice;

    updatedCart.cartItems.subtotal = updatedCart.cartItems.quantity * itemPrice;

    // Update the total price
    updatedCart.totalPrice = updatedCart.cartItems.reduce((total, item) => total + item.subtotal, 0);

    await updatedCart.save();

    res.status(200).send({
      message: "Item quantity updated successfully",
      updatedCart: updatedCart});

  }
  catch (error) {
    errorHandler(error, req, res)
  }
};

// [SECTION] Remove Item from Cart
module.exports.removeFromCart =  async (req, res) => {
    try {
        const userId = req.user.id;
        const productId = req.params.productId;

        const cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found for the user' });
        }

        const productIndex = cart.cartItems.findIndex(item => item.productId === productId);

        if (productIndex === -1) {
            return res.status(404).json({ message: 'Item not found in cart' });
        }

        const removedItem = cart.cartItems.splice(productIndex, 1)[0];
        cart.totalPrice -= removedItem.price * removedItem.quantity;

        cart.totalPrice = Math.max(cart.totalPrice, 0);

        await cart.save();

        return res.status(200).json({ 
            message: 'Item removed from cart successfully', 
            updatedCart: cart 
        });
    } catch (error) {
        return res.status(500).json({ 
            message: 'An error occurred while processing your request', 
            error: error.message 
        });
    }
};


// [SECTION] Clear Cart
module.exports.clearCart = async (req, res) => {
    try {
        const userId = req.user.id;

        const cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found for the user' });
        }

        if (cart.cartItems.length > 0) {
            cart.cartItems = [];
            cart.totalPrice = 0;
        } else {
            return res.status(404).json({ message: 'Cart is already empty' });
        }

        await cart.save();

        return res.status(200).json({ 
            message: 'Cart cleared successfully', 
            cart: cart 
        });
    } catch (error) {
        return res.status(500).json({ 
            message: 'An error occurred while processing your request', 
            error: error.message 
        });
    }
};