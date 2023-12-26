'use strict'

import { Product } from '../models/productModel.js';
import { Users } from "../models/usersModel.js";
import productService from "../services/productService.js";
import userService from "../services/sessionService.js"

// const productServiceInstance = new productService();

export const getProducts = async (req, res) => {

    try {
        const currPage = parseInt(req.query.page) || 1;
        const results = await productService.getProducts(req.query)

        if (results.length === 0) {
            const responseError = {
                status: 'error',
                payload: 'No products found',
            };

            return res.status(404).json(responseError);
        }
        // const hasNextPage = page < totalPages;
        // const hasPrevPage = page > 1;
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

        console.log(userData)
        let admin;
        if (userData._doc.role === 'ADMIN') {
            admin = true
        } else {
            admin = false
        }
        // res.status(200).json(response);
        res.render('allProducts', {
            response,
            products: results.docs,
            user: userData,
            admin
        });
    } catch (err) {
        console.log(err)
        res.status(500).send({
            status: 500,
            message: err.message,
        })
    }
}

export const saveProduct = async (req, res) => {
    try {
        // const product = new Product({
        //     title: req.body.title,
        //     description: req.body.description,
        //     price: parseFloat(req.body.price),
        //     thumbnails: req.body.thumbnails,
        //     code: req.body.code,
        //     stock: req.body.stock,
        //     status: req.body.status,
        //     category: req.body.category,
        // })

        const productSave = await productService.saveProduct(req.body)
        res.status(201).send({
            productSave,
        })
    } catch (err) {
        console.log(err)
        res.status(500).send({
            status: 500,
            message: err.message,
        })
    }
}

export const getProductByID = async (req, res) => {
    try {
        // const query = Product.where({ _id: req.params.pid })

        const products = await productService.getProductId(req.params.pid)

        if (!products) {
            return res.status(404).send({
                status: 404,
                message: 'No products found',
            })
        }

        // return res.status(200).send({
        //     status: 200,
        //     message: 'Ok',
        //     data: products,
        res.render('productDetail', products)

    } catch (err) {
        console.log(err)
        res.status(500).send({
            status: 500,
            message: err.message,
        })
    }
}

export const deleteProduct = async (req, res) => {
    try {
        const products = await productService.deleteProduct(req.params.pid)
        // const products = await Product.deleteOne({ _id: req.params.pid })

        if (!products) {
            return res.status(404).send({
                status: 404,
                message: 'No products deleted',
            })
        }

        return res.status(200).send({
            status: 200,
            message: 'Ok',
            data: `Product ID: ${req.params.pid} deleted`,
        })
    } catch (err) {
        console.log(err)
        res.status(500).send({
            status: 500,
            message: err.message,
        })
    }
}

export const modifyProduct = async (req, res) => {
    try {

        const filter = { _id: req.params.pid }


        const products = await productService.updateProduct(req.body)
        if (!products) {
            return res.status(404).send({
                status: 404,
                message: 'No products updated',
            })
        }

        return res.status(200).send({
            status: 200,
            message: 'Ok',
            data: `Product ID: ${req.params.pid} updated with info: ${products}`,
        })
    } catch (err) {
        console.log(err)
        res.status(500).send({
            status: 500,
            message: err.message,
        })
    }
}