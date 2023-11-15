'use strict'

import { Product } from '../models/productModel.js'

export const getProducts = async (req, res) => {


    const sortField = req.query.sort || 'price';
    const sortOrder = parseInt(req.query.order === 'desc' ? '-1' : '1');

    const currPage = parseInt(req.query.page) || 1;
    const qlimit = parseInt(req.query.limit, 10) || 3;;

    const { category, minStock } = req.query; // Assuming query parameters for category and minStock

    const filter = {};
    if (category) {
        filter.category = category;
    }
    if (minStock) {
        filter.stock = { $gt: parseInt(minStock) || 0 };
    }

    try {
        // const totalCount = await Product.countDocuments(filter);
        // const totalPages = Math.ceil(totalCount / limit);
        const options = {
            page: currPage, // Page number
            limit: qlimit, // Number of documents per page

        };

        options.sort = { [sortField]: sortOrder };

        const results = await Product.paginate(filter, options)
        // .find(filter)
        // .skip((page - 1) * limit)
        // .limit(limit)



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
            price: parseFloat(req.body.price),
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