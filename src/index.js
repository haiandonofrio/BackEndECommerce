'use strict'

import { createServer } from 'node:http'
import express from 'express';
import productsRoutes from './routes/products.js';
import cartRoutes from './routes/cart.js';
import realtimeprodsRoutes from './routes/realtimeprods.js';
import { join } from 'node:path'
import { Server } from 'socket.io';
import { engine } from 'express-handlebars';
import { ProductManager } from './ProductManager.js'; // Adjust the import path as needed

// Create an instance of the ProductManager class, specifying the path to the data file
const productManager = new ProductManager('products.json'); // Specify the correct file path

const app = express();
const server = createServer(app)
const io = new Server(server)
const port = 3000; // Set your desired port number

app.engine('.hbs', engine({
    extname: '.hbs',
    // layoutsDir: join(app.get('views'), 'layouts'),
    defaultLayout: 'main'
}))
// Tell Express to use the handlebars template engine for rendering HTML files with .hbs extension
app.set("view engine", ".hbs");
app.set('views', join(process.cwd(), 'src', 'views'));

// /* This is a middleware function that will be executed before any other route handler */
app.use(express.static(join(process.cwd(), '/public')));


app.use('/api/products', productsRoutes);

app.use('/api/carts', cartRoutes);

app.use('/realtimeproducts', realtimeprodsRoutes)

// try {
//     const products = JSON.parse(await productManager.getProducts());

// } catch (error) {
//     console.log(error)
// }

io.on('connection', (socket) => {
    console.log('Socket conectado')
    socket.on('message', data => {
        console.log(`Mensaje recibido ${data}`)
    })
    // socket.emit('productList', { products });

})
// Start the Socket server
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// app.listen(port, () => {
//     console.log(`Server is running on port ${port}`);
// });

