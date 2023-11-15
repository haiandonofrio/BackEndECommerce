'use strict'

import { Cart } from '../models/cartModel.js'

export const getCarts = async (req, res) => {
    try {
        const carts = await Cart.find({}).select(['-__v'])

        if (!carts) {
            return res.status(404).send({
                status: 404,
                message: 'No carts found',
            })
        }

        const limit = parseInt(req.query.limit, 10)
        if (!isNaN(limit)) {
            carts.slice(0, limit)
            return res.status(200).send({
                status: 200,
                message: 'Ok',
                data: carts,
            })

            // res.json(JSON.parse(products.slice(0, limit)))
        } else {
            return res.status(200).send({
                status: 200,
                message: 'Ok',
                data: carts,
            })
        }
    } catch (err) {
        console.log(err)
        res.status(500).send({
            status: 500,
            message: err.message,
        })
    }
}

export const createCart = async (req, res) => {
    try {
        const cart = new Cart({
            products: [],
        })

        const cartSave = await cart.save()
        res.status(201).send({
            cartSave,
        })
    } catch (err) {
        console.log(err)
        res.status(500).send({
            status: 500,
            message: err.message,
        })
    }
}

export const getCartbyId = async (req, res) => {
    try {
        const query = Cart.where({ _id: req.params.cid })
        const carts = await query.findOne()

        if (!carts) {
            return res.status(404).send({
                status: 404,
                message: 'No cart found',
            })
        }

        return res.status(200).send({
            status: 200,
            message: 'Ok',
            data: carts,
        })
    } catch (err) {
        console.log(err)
        res.status(500).send({
            status: 500,
            message: err.message,
        })
    }
}

export const deleteCart = async (req, res) => {
    
        const { cid } = req.params;

        try {
            const updatedCart = await Cart.findByIdAndUpdate(
                cid,
                { $set: { products: [] } },
                { new: true } // To return the updated document
            );

            if (updatedCart) {
                // Cart updated successfully
                console.log('Cart updated:', updatedCart);
                res.status(200).json({ message: 'Cart updated successfully', cart: updatedCart });
            } else {
                // Cart with the given ID not found
                console.log('Cart not found');
                res.status(404).json({ message: 'Cart not found' });
            }
        }
        catch (err) {
            console.log(err)
            res.status(500).send({
                status: 500,
                message: err.message,
            })
        }
    }

export const deleteProductFromCart = async (req, res) => {
    const { cid, pid } = req.params;

    try {
        const updatedCart = await Cart.findByIdAndUpdate(
            cid,
            { $pull: { products: { producto: pid } } },
            { new: true }
        ).populate('products.producto');

        if (updatedCart) {
            // Product deleted from the cart
            console.log('Product deleted from cart:', updatedCart);
            res.status(200).json({ message: 'Product deleted from cart', cart: updatedCart });
        } else {
            // Cart with the given ID not found
            console.log('Cart not found');
            res.status(404).json({ message: 'Cart not found' });
        }
    } catch (error) {
        // Handle error
        console.error('Error deleting product from cart:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const addProductToCart = async (req, res) => {

        const { cid, pid } = req.params;
        const { quantity } = req.body;

        try {
            const cart = await Cart.findOneAndUpdate(
                { _id: cid, 'products.producto': pid },
                { $inc: { 'products.$.quantity': quantity || 1 } },
                { new: true } // Return the modified document
            ).populate('products.producto');

            if (!cart) {

                const newCart = new Cart({
                    _id: cid,
                    products: [{ producto: pid, quantity: 1 }],
                });
                const savedCart = await newCart.save();
                return res.json(savedCart);
            }

            // At this point, 'cart' contains the cart with the updated quantity
            res.json(cart);

        } catch (err) {
            console.log(err)
            res.status(500).send({
                status: 500,
                message: err.message,
            })
        }
    }