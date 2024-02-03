'use strict'


import mongoose from 'mongoose'

const { Schema, model } = mongoose

const userSchema = new Schema({
    first_name: String,
    last_name: String,
    email: String,
    age: Number,
    password: String,
    cart: {
        type: [{
            cid: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "carts"
            }
        }],
        default: [],
        required: true,
    },
    role: {
        type: String,
        enum: ['USER', 'ADMIN', 'PREMIUM'],
        default: 'USER' // Set default value to false for users who are not admins
    }
},
)

export const Users = model('users', userSchema)
