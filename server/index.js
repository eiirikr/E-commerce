// [SECTION] Dependencies and Modules
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// [SECTION] Routes
const userRoutes = require("./routes/user.js");
const productRoutes = require("./routes/product.js");
const cartRoutes = require("./routes/cart.js");
const orderRoutes = require("./routes/order.js");

// [SECTION] Environment Setup
require("dotenv").config();

// [SECTION] Server Setup
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Update CORS options to use BASE_URL from the environment
const corsOptions = {
  origin: [
    "http://zuitt-bootcamp-prod-482-8068-javier.s3-website.us-east-1.amazonaws.com",
    "http://zuitt-bootcamp-prod-482-8075-velasco.s3-website.us-east-1.amazonaws.com",
    "http://localhost:8000",
    "http://localhost:4002",
    "http://localhost:3000",
  ],
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

// [SECTION] Database Connection
mongoose.connect(process.env.MONGODB_STRING, {});
mongoose.connection.once("open", () =>
  console.log("Now Connected to MongoDB Atlas.")
);

// [SECTION] Backend Routes
app.use("/b2/users", userRoutes);
app.use("/b2/products", productRoutes);
app.use("/b2/cart", cartRoutes);
app.use("/b2/orders", orderRoutes);

// [SECTION] Server Gateway Response
if (require.main === module) {
  app.listen(process.env.PORT || 3000, () => {
    console.log(`API is now online on port ${process.env.PORT || 3000}`);
  });
}

module.exports = { app, mongoose };
