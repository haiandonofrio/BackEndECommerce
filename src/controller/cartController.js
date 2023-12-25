'use strict'

import { Cart } from '../models/cartModel.js';
import cartService from '../services/cartService.js';

export const getCarts = async (req, res) => {
    try {
        const carts = await cartService.getCarts()

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


        const cartSave = await cartService.createCart()
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
        // const query = Cart.where({ _id: req.params.cid })
        const carts = await cartService.getCartId(req.params.cid)

        if (!carts) {
            return res.status(404).send({
                status: 404,
                message: 'No cart found',
            })
        }
        const productData = carts.products.map(product => ({
            title: product.producto.title,
            description: product.producto.description,
            quantity: product.quantity,
            price: product.producto.price * product.quantity,

        }));
        res.render('cartDetail', { products: productData });

    } catch (err) {
        console.log(err)
        res.status(500).send({
            status: 500,
            message: err.message,
        })
    }
}

export const deleteCart = async (req, res) => {
    try {
        // const query = Product.where({ id: req.params.pid });
        const carts = await cartService.deleteCart(req.params.pid)

        if (!carts) {
            return res.status(404).send({
                status: 404,
                message: 'No carts deleted',
            })
        }

        return res.status(200).send({
            status: 200,
            message: 'Ok',
            data: `Cart ID: ${req.params.cid} deleted`,
        })
    } catch (err) {
        console.log(err)
        res.status(500).send({
            status: 500,
            message: err.message,
        })
    }
}
export const deleteProductFromCart = async (req, res) => {
    try {

        const updatedCart = await cartService.deleteProduct(req.params)

        if (updatedCart) {
            console.log('Product deleted from cart', updatedCart);
            res.status(200).json({ message: 'Product deleted from cart', cart: updatedCart });
        }

        else {
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



    try {
        const { quantity } = req.body;

        const cart = await cartService.addProduct(req.params, quantity)

        // res.json(cart);
        const productData = cart.products.map(product => ({
            title: product.producto.title,
            description: product.producto.description,
            quantity: product.quantity,
            price: product.producto.price * product.quantity,

        }));
        res.render('cartDetail', { products: productData });


        // At this point, 'cart' contains the cart with the updated quantity
    } catch (err) {
        console.log(err)
        res.status(500).send({
            status: 500,
            message: err.message,
        })
    }
}
export const updateProduct = async (req, res) => {
    try {
        const { products } = req.body;

        const cartId = req.params.cid;

        const updatedCart = await cartService.updateProduct(products, cartId)

        if (updatedCart) {
            res.status(200).json({
                status: 'success',
                message: 'Carrito actualizado con éxito.',
                data: updatedCart,
            });
        } else {
            res.status(404).json({
                status: 'error',
                message: `No se encontró carrito ${cartId} para actualizar`,
                data: updatedCart,
            });
}

    } catch (error) {
        console.error('Error actualizando el carrito:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error interno del servidor.',
        });
    }
};