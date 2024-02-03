'use strict'

import { ERROR, SUCCESS } from '../commons/errorMessages.js';
import { Cart } from '../models/Models/cartModel.js';
import cartService from '../services/cartService.js';
import productService from '../services/productService.js';
import { generateUniqueCode } from '../utils/helpers.js';

export const getCarts = async (req, res) => {
    try {
        const carts = await cartService.getCarts()

        if (!carts) {
            return res.status(404).send({
                status: 404,
                message: ERROR.CART_NOT_FOUND,
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
                message: ERROR.CART_NOT_FOUND,
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
                message: ERROR.CART_NOT_DELETED,
            })
        }

        return res.status(200).send({
            status: 200,
            message: SUCCESS.CART_DELETED,
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
        const { cid, pid } = req.params;
        const updatedCart = await cartService.deleteProduct(cid, pid)

        if (updatedCart) {
            console.log('Product deleted from cart', updatedCart);
            res.status(200).json({ message: SUCCESS.PRODUCT_DELETED_FROM_CART, cart: updatedCart });
        }

        else {
            // Cart with the given ID not found
            console.log(ERROR.CART_NOT_FOUND);
            res.status(404).json({ message: ERROR.CART_NOT_FOUND });
        }
    } catch (error) {
        // Handle error
        console.error(ERROR.PRODUCT_DELETE_ERROR, error);
        res.status(500).json({ message: ERROR.SERVER_ERROR });
    }
};

export const addProductToCart = async (req, res) => {



    try {
        const { quantity } = req.body;

        const cart = await cartService.addProduct(req.params, quantity,req.session.user.email)

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
                message: SUCCESS.CART_UPDATED,
                data: updatedCart,
            });
        } else {
            res.status(404).json({
                status: 'error',
                message: ERROR.CART_NOT_UPDATED,
                data: updatedCart,
            });
        }

    } catch (error) {
        console.error(ERROR.CART_NOT_UPDATED, error);
        res.status(500).json({
            status: 'error',
            message: ERROR.SERVER_ERROR,
        });
    }
};

export const purchaseCart = async (req, res) => {

    try {

        const cartId = req.params.cid;

        // Obtener el carrito
        const cart = await cartService.getCartId(cartId)

        const processedProducts = [];
        const unprocessedProductIds = [];
        // Verificar el stock y actualizar la base de datos
        for (const cartProduct of cart.products) {

            const productId = cartProduct.producto;
            const requestedQuantity = cartProduct.quantity;

            const product = await productService.getProductId(productId);

            if (product.stock >= requestedQuantity && product.status !== false) {
                // Suficiente stock, restar del stock y continuar
                product.stock -= requestedQuantity;
                if (product.stock === 0) {
                    product.status = false;
                }
                const product = await productService.getProductId(productId);
                const productUpdated = await updateProduct.getProductId(product);// Llenar el array con la información del producto procesado
                processedProducts.push({
                    //   productId: product._id,
                    product: product.title,
                    quantity: requestedQuantity,
                    //   unitPrice: product.price,
                });

                // Quitar el producto del array 'products' en el carrito
                await cartService.deleteProduct(cartId, productId)

            } else {
                // No hay suficiente stock, agregar el ID del producto al array de no procesados
                unprocessedProductIds.push(`${ERROR.STOCK_LIMIT} ${cartProduct._doc.title}`);
            }
        }

        if (processedProducts.length > 0) {
            // Si hay productos procesados, generar el ticket
            const ticket = {
                code: generateUniqueCode(),
                purchase_datetime: new Date(),
                amount: processedProducts.reduce((total, product) => total + product.quantity * product.unitPrice, 0),
                purchaser: cart.purchaser,
                processedProducts,
            };


            // Puedes hacer algo con el ticket, como guardarlo en la base de datos o devolverlo como respuesta
            // En este ejemplo, simplemente lo devolvemos como respuesta
            if (unprocessedProductIds.length > 0) {
                res.status(200).json({ message: SUCCESS.PURCHASE_SUCCESSFUL, ticket, unprocessedProductIds });
            } else {
                res.status(200).json({ message: SUCCESS.PURCHASE_SUCCESSFUL, ticket })
            }
        }

        // if (unprocessedProductIds.length > 0) {
        //   // Si hay productos no procesados, devolver sus IDs
        //   res.status(400).json({ error: 'Algunos productos no tienen suficiente stock', unprocessedProductIds });
        // }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: ERROR.SERVER_ERROR });
    }
};