'use strict'

import { createServer } from 'node:http'
import express from 'express';
import productsRoutes from './routes/products.js';
import cartRoutes from './routes/cart.js';
import realtimeprodsRoutes from './routes/realtimeprods.js';
import __dirname from './utils.js';
import { Server } from 'socket.io';
import { engine } from 'express-handlebars';
import { ProductManager } from './ProductManager.js'; // Adjust the import path as needed

// Create an instance of the ProductManager class, specifying the path to the data file
const productManager = new ProductManager('products.json'); // Specify the correct file path

const app = express();
const server = createServer(app)
const io = new Server(server)
const port = 8080; // Set your desired port number

app.engine('handlebars', engine({ extname: 'hbs', defaultLayout: 'main' }))
// Tell Express to use the handlebars template engine for rendering HTML files with .hbs extension
app.set("view engine", "handlebars");
app.set('views', __dirname + "/views");


/* This is a middleware function that will be executed before any other route handler */
app.use(express.static(__dirname + "/public"))


app.use('/api/products', productsRoutes);

app.use('/api/carts', cartRoutes);

app.use('/realtimeproducts', realtimeprodsRoutes)

try {
    const products = JSON.parse(await productManager.getProducts());

} catch (error) {
    console.log(error)
}

io.on('connection', (socket) => {
    console.log('Socket conectado')

    socket.emit('productList', { products });

})
// Start the Express server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
