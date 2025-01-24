const Product = require("../models/Product.js");

const {errorHandler} = require('../auth.js');


// [SECTION] Create Products
module.exports.createProduct = async (req, res) => {
  try{
    const name = req.body.name
    const productExists = await Product.findOne({name});

    if (productExists) {
      return res.status(409).send({
        message: 'Product already exists'
      });
    }

    let newProduct = new Product({
      name : req.body.name,
      description : req.body.description,
      price : req.body.price
    });

    await newProduct.save();

    return res.status(201).send(newProduct);

  } catch (error) {
    errorHandler(error, req, res);
  }
};

// [SECTION] Retrieve all products
module.exports.retrieveAllProducts = async (req, res) => {
  try{
    const allProducts = await Product.find({});

    if (allProducts.length > 0) {

      return res.status(200).send(allProducts);

    } else {

      return res.status(404).send({
        message: 'No products'
      })
    }
  }
  catch (error) {
    errorHandler(error, req, res);
  }
};

// [SECTION] Retrieve all active products
module.exports.retrieveActiveProducts = async (req, res) => {
  try{

    const activeProducts = await Product.find({isActive:true})

    if (activeProducts.length > 0){
      return res.status(200).send(activeProducts)
    } else {
      return res.status(200).send({
        message: 'No active products found'
      });
    }
  }
  catch (error) {
    errorHandler(error, req, res);
  }
};

// [SECTION] Retrieve single product
module.exports.retrieveSingleProduct = async (req, res) => {
  try{
    const singleProduct = await Product.findById(req.params.productId)

    if (singleProduct) {
      return res.status(200).send(singleProduct);
    } else {
      return res.status(404).send({
        message: 'Product not found'
      })
    }
  }
  catch (error) {
    errorHandler(error, req, res);
  }
};

// [SECTION] Update product info
module.exports.updateProductInfo = async (req, res) => {
  try {
    let updatedCourse = {
      name : req.body.name,
      description : req.body.description,
      price : req.body.price
    }

    const productToUpdate = await Product.findByIdAndUpdate(req.params.productId, updatedCourse)
    
    if (productToUpdate) {
      return res.status(200).send({
        success: true,
        message: 'Product updated successfully'
      });
    } else {
      res.status(404).send({
        message: 'Product not found'
      });
    }
  }
  catch (error) {
    errorHandler(error, req, res);
  }
};

// [SECTION] Archive Product
module.exports.archiveProduct = async (req, res) => {
  try {

    let updateActiveField = {
      isActive: false
    };

    const archivedProduct = await Product.findByIdAndUpdate(req.params.productId, updateActiveField)
    
    if (archivedProduct) {
      if (!archivedProduct.isActive){
        return res.status(200).send({
          message: 'Product already archived',
          archivedProduct: archivedProduct
        })
      } else {
        return res.status(200).send({
          success: true,
          message: 'Product archived successfully'
        })
      }
    } else {
      res.status(404).send({
        error: 'Product not found'
      })
    }

  }
  catch (error) {
    errorHandler(error, req, res);
  }
};

// [SECTION] Activate Product
module.exports.activateProduct = async (req, res) => {
  try {

    let updateActiveField = {
      isActive: true
    };

    const activatedProduct = await Product.findByIdAndUpdate(req.params.productId, updateActiveField)
    
    if (activatedProduct) {
      if (!activatedProduct.isActive){
        return res.status(200).send({
          success: true,
          message: 'Product activated successfully'
        })
      } else {
        return res.status(200).send({
          message: 'Product already activated',
          activateProduct: activatedProduct
        })
      }
    } else {
      res.status(404).send({
        error: 'Product not found'
      })
    }

  }
  catch (error) {
    errorHandler(error, req, res);
  }
};

// [SECTION] Search for products by their name
module.exports.searchProductsByName = async (req, res) => {
    try {
        const { name } = req.body;
    
        // Use a regular expression to perform a case-insensitive search
        const products = await Product.find({
            name: { $regex: name, $options: 'i' }
        });
    
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// [SECTION] Search for products by price range
module.exports.searchProductsByPrice = async (req, res) => {
    try {
        const { minPrice, maxPrice } = req.body;

        const min = parseFloat(minPrice) || 0;
        const max = parseFloat(maxPrice) || Number.MAX_VALUE;

        if (min < 0 || max < 0 || min > max) {
            return res.status(400).json({
                error: 'Invalid price range. Ensure that minPrice and maxPrice are valid and minPrice <= maxPrice.'
            });
        }

        const products = await Product.find({
            price: { $gte: min, $lte: max }
        });

        if (products.length === 0) {
            return res.status(404).json({ message: 'No products found within the specified price range.' });
        }

        res.status(200).json(products);
    } catch (error) {
        console.error('[Error in searchProductsByPrice]:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
