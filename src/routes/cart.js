'use strict'

import express from 'express'
import { getCarts, createCart, getCartbyId, deleteCart,purchaseCart, addProductToCart, deleteProductFromCart, updateProduct } from '../controller/cartController.js'
import roleAuth from '../middlewares/roleAuth.js'
import { apllyPolicy } from '../middlewares/auth.js'
const router = express.Router()
router.use(express.json())
router.use(express.urlencoded({ extended: true }))

// Create Cart
router.post('/',apllyPolicy(['USER']), createCart)

router.get('/', getCarts)
// Get a Cart by ID
router.get('/:cid', getCartbyId)

router.delete('/:cid', deleteCart)
// Create a new product or add products to Cart
router.post('/:cid/products/:pid', addProductToCart)


// DELETE /api/carts/:cid/products/:pid
//nueva parte  
router.delete('/:cid/products/:pid', deleteProductFromCart);
//Agrega varios productos 
router.put('/:cid', updateProduct);

router.post('/:cid/purchase', purchaseCart)

export { router }