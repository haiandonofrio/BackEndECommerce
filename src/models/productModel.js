'use strict'

import mongoose from "mongoose";

const productCollection = 'products'

const productSchema = new mongoose.Schema({
    // _id: ObjectId, // Automatically generated unique identifier (ObjectId) for each document
    id: String,
    title: String,
    description: String,
    price: String, // You can store the price as a floating-point number without specifying the number of decimal places
    thumbnails: [String], // An array of strings to store thumbnail URLs
    code: String,
    stock: String,
    status: String,
    category: String
}
)

export const productModel = mongoose.model(productCollection, productSchema);