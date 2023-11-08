'use strict'

import mongoose from "mongoose"
import { config } from "./config.js"


const { connect, connection } = mongoose

mongoose.set('strictQuery', false)

const mongooseOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}

try {
    await connect(config.MONGODB_URI, mongooseOptions)
        .then(() => console.log('Connection has been successfully'))

} catch (error) {
    handleError(error);
}


if (process.env.NODE_ENV !== 'production') {
    connection.on('error', err => console.log(err))
}



const db = mongoose.connection;

db.on('error', (error) => {
    console.error('MongoDB connection error:', error);
});

db.once('open', () => {
    console.log('Connected to MongoDB Atlas');
});

export { db }