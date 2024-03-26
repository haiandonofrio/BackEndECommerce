'use strict'

import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2'

const { Schema, model } = mongoose
const ProductSchema = new Schema({
    id: {
        type: Number,
        required: false,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    thumbnails: {
        type: [String],
        required: true,
    },
    code: {
        type: String,
        required: true,
    },
    stock: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        required: true,
    },
    owner: {
        type: String,
        required: false
    },
    ownerRole: {
        type: String,
        required: false,
        default: 'ADMIN'
    },
    category: {
        type: String,
        required: true,
    },
    createdAt: { type: Date, default: Date.now },
    UpdatedAt: { type: Date, default: Date.now },
});

ProductSchema.plugin(mongoosePaginate);
export const Product = model('products', ProductSchema)