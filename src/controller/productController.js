'use strict'

import { Product } from '../models/Models/productModel.js';
import { Users } from "../models/Models/usersModel.js";
import productService from "../services/productService.js";
import userService from "../services/usersService.js"
import { ERROR, SUCCESS } from "../commons/errorMessages.js"; // Import ERROR object

export const getProducts = async (req, res) => {
    try {
        const currPage = parseInt(req.query.page) || 1;
        const results = await productService.getProducts(req.query)

        if (results.length === 0) {
            const responseError = {
                status: 'error',
                payload: ERROR.NO_PRODUCTS_FOUND,
            };

            return res.status(404).json(responseError);
        }

        const hasNextPage = results.hasNextPage;
        const hasPrevPage = results.hasPrevPage;
        let prevLink = null;
        let nextLink = null;

        if (hasPrevPage) {
            prevLink = `/api/product?page=${currPage - 1}`;
        }

        if (hasNextPage) {
            nextLink = `/api/product?page=${currPage + 1}`;
        }
        const totalPages = results.totalPages;

        const response = {
            status: 'success',
            payload: results.docs,
            totalPages,
            currPage,
            prevPage: hasPrevPage ? currPage - 1 : null,
            nextPage: hasNextPage ? currPage + 1 : null,
            hasPrevPage,
            hasNextPage,
            prevLink,
            nextLink,
        };

        const { email } = req.session.user
        const userData = await userService.getUser(email);

        let admin;
        if (userData.role === 'ADMIN') {
            admin = true
        } else {
            admin = false
        }

`${nextLink}`
        const cart = userData.cart._id;

        res.render('allProducts', {
            response,
            products: results.docs,
            user: userData,
            admin,
            cart
        });
    } catch (err) {
        console.log(err)
        res.status(500).send({
            status: 500,
            message: ERROR.NO_PRODUCTS_FOUND,
        })
    }
}

export const saveProduct = async (req, res) => {
    try {
        const productSave = await productService.saveProduct(req.body)
        if (!productSave) {
            return res.status(500).send({
                status: 500,
                message: ERROR.PRODUCT_NOT_SAVED,
            })
        }
        res.status(201).send({
            status: 'success',
            message: SUCCESS.PRODUCT_SAVED,
            productSave,
        })
    } catch (err) {
        console.log(err)
        res.status(500).send({
            status: 500,
            message: ERROR.PRODUCT_NOT_SAVED,
        })
    }
}

export const getProductByID = async (req, res) => {
    try {
        const products = await productService.getProductId(req.params.pid)

        if (!products) {
            return res.status(404).send({
                status: 404,
                message: ERROR.PRODUCT_NOT_FOUND,
            })
        }
        res.status(200).send({
            body: products
        })
        // res.render('productDetail', products)
    } catch (err) {
        console.log(err)
        res.status(500).send({
            status: 500,
            message: ERROR.PRODUCT_NOT_FOUND,
        })
    }
}

export const deleteProduct = async (req, res) => {
    try {
        const products = await productService.deleteProduct(req.params.pid, req.session.user.email)

        if (!products) {
            return res.status(404).send({
                status: 404,
                message: ERROR.PRODUCT_NOT_DELETED,
            })
        }

        return res.status(200).send({
            status: 'success',
            message: SUCCESS.PRODUCT_DELETED,
            data: `Product ID: ${req.params.pid} deleted`,
        })
    } catch (err) {
        console.log(err)
        res.status(500).send({
            status: 500,
            message: ERROR.PRODUCT_NOT_DELETED,
        })
    }
}

export const modifyProduct = async (req, res) => {
    try {
        const filter = { _id: req.params.pid }


        const products = await productService.updateProduct(req.body, req.session.user.email)
        if (!products) {
            return res.status(404).send({
                status: 404,
                message: ERROR.PRODUCT_NOT_UPDATED,
            })
        }

        return res.status(200).send({
            status: 'success',
            message: SUCCESS.PRODUCT_UPDATED,
            data: `Product ID: ${req.params.pid} updated with info: ${products}`,
        })
    } catch (err) {
        console.log(err)
        res.status(500).send({
            status: 500,
            message: ERROR.PRODUCT_NOT_UPDATED,
        })
    }
}
