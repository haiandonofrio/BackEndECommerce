'use strict'

import { Product } from '../models/productModel.js'

export const getProducts = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;

    const { category, minStock } = req.query; // Assuming query parameters for category and minStock

    const filter = {};
    if (category) {
        filter.category = category;
    }
    if (minStock) {
        filter.stock = { $gt: parseInt(minStock) };
    }

    try {
        const totalCount = await Product.countDocuments(filter);
        const totalPages = Math.ceil(totalCount / limit);

        const results = await Product.find(filter)
            .skip((page - 1) * limit)
            .limit(limit);

        if (results.length === 0) {
            const responseerror = {
                status: 'error',
                payload: 'No products found',
            };

            return res.status(404).json(responseerror);
        }
        const hasNextPage = page < totalPages;
        const hasPrevPage = page > 1;

        let prevLink = null;
        let nextLink = null;

        if (hasPrevPage) {
            prevLink = `/api/products?page=${page - 1}`;
        }

        if (hasNextPage) {
            nextLink = `/api/products?page=${page + 1}`;
        }

        const response = {
            status: 'success',
            payload: results,
            totalPages,
            prevPage: hasPrevPage ? page - 1 : null,
            nextPage: hasNextPage ? page + 1 : null,
            hasPrevPage,
            hasNextPage,
            prevLink,
            nextLink,
        };

        res.status(200).json(response);
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
        const product = new Product({
            title: req.body.title,
            description: req.body.description,
            price: req.body.price,
            thumbnails: req.body.thumbnails,
            code: req.body.code,
            stock: req.body.stock,
            status: req.body.status,
            category: req.body.category,
        })

        const productSave = await product.save()
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
        const query = Product.where({ _id: req.params.pid })
        console.log(req.params)
        const products = await query.findOne()

        if (!products) {
            return res.status(404).send({
                status: 404,
                message: 'No products found',
            })
        }

        return res.status(200).send({
            status: 200,
            message: 'Ok',
            data: products,
        })
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
        // const query = Product.where({ id: req.params.pid });
        const products = await Product.deleteOne({ _id: req.params.pid })

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
        // const query = Product.where({ id: req.params.pid });
        const filter = { _id: req.params.pid }

        const update = {
            title: req.body.title,
            description: req.body.description,
            price: req.body.price,
            thumbnails: req.body.thumbnails,
            code: req.body.code,
            stock: req.body.stock,
            status: req.body.status,
            category: req.body.category,
        }

        // `doc` is the document _after_ `update` was applied because of
        // `returnOriginal: false`
        const products = await Product.findOneAndUpdate(filter, update, {
            returnOriginal: false,
        })

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