'use strict'

import express from 'express';
// import { productSchema } from '../models/productModel.js'
// import { ProductManager } from '../controller/ProductManager.js'; // Adjust the import path as needed
import passport from 'passport';
import roleAuth from '../middlewares/roleAuth.js';
import { getProducts, saveProduct, getProductByID, deleteProduct, modifyProduct } from '../controller/productController.js';

const router = express.Router();


// Create an instance of the ProductManager class, specifying the path to the data file
// const productManager = new ProductManager('products.json'); // Specify the correct file path

// Middleware to parse JSON request bodies
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

// Get all products
router.get('/', getProducts);

// Get a product by ID
router.get('/:pid', getProductByID)

// Create a new product
router.post('/', roleAuth('current',true,'CREATE'),saveProduct)

// Update a product by ID
router.put('/:pid',roleAuth('current',true,'UPDATE'), modifyProduct)

// Delete a product by ID
router.delete('/:pid',roleAuth('current',true,'DELETE'), deleteProduct)


export { router };
