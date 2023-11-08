'use strict'

import mongoose from "mongoose";

const { Schema, model } = mongoose
const cartSchema = new Schema({

    products: {
        type: [String],
        required: true,
    },

    createdAt: { type: Date, default: Date.now },
    UpdatedAt: { type: Date, default: Date.now },
});

export const Cart = model('carts', cartSchema)