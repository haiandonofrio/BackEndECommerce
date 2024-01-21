'use strict'

import cartService from '../services/cartService.js';
import { ERROR, SUCCESS } from "../commons/errorMessages.js";

export const getCarts = async (req, res) => {
    try {
        const carts = await cartService.getCarts()

        if (!carts) {
            return res.status(404).send({
                status: 404,
                message: ERROR.NO_CARTS_FOUND,
            })
        }

        const limit = parseInt(req.query.limit, 10)
        if (!isNaN(limit)) {
            carts.slice(0, limit)
            return res.status(200).send({
                status: 200,
                message: SUCCESS.CARTS_RETRIEVED,
                data: carts,
            })
        } else {
            return res.status(200).send({
                status: 200,
                message: SUCCESS.CARTS_RETRIEVED,
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
        const cartSave = await cartService.createCart(req.session.user.email)
        res.status(201).send({
            status: 'success',
            message: SUCCESS.CART_CREATED,
            cartSave,
        })
    } catch (err) {
        console.log(err)
        res.status(500).send({
            status: 500,
            message: ERROR.CART_NOT_CREATED,
        })
    }
}

// ... (remaining functions)

export const deleteProductFromCart = async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const updatedCart = await cartService.deleteProduct(cid, pid)

        if (updatedCart) {
            console.log('Product deleted from cart', updatedCart);
            res.status(200).json({ status: 'success', message: SUCCESS.PRODUCT_DELETED_FROM_CART, cart: updatedCart });
        } else {
            console.log('Cart not found');
            res.status(404).json({ status: 'error', message: ERROR.PRODUCT_NOT_DELETED_FROM_CART });
        }
    } catch (error) {
        console.error('Error deleting product from cart:', error);
        res.status(500).json({ status: 'error', message: ERROR.PRODUCT_NOT_DELETED_FROM_CART });
    }
};

// ... (remaining functions)
