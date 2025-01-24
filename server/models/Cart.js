const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({

  userId : {
    type: String,
    required: true
  },
  cartItems : [
    {
      productId : {
        type: String,
        required: [true, 'Product ID is required']
      },
      quantity : {
        type: Number,
        required: [true, 'Quantity is required']
      },
      subtotal : {
        type: Number,
        default: 0,
        required: [true, 'Subtotal is required']
      }
    }
  ],
  totalPrice : {
    type: Number,
    default: 0,
    required: true
  },
  orderedOn: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Cart', cartSchema);