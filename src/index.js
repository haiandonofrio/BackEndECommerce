'use strict'

import server from './server.js'


const port = 3000

server.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
});










// const app = express();
// const server = createServer(app)
// const io = new Server(server)
// const port = 3000; // Set your desired port number

// app.engine('.hbs', engine({
//     extname: '.hbs',
//     // layoutsDir: join(app.get('views'), 'layouts'),
//     defaultLayout: 'main'
// }))
// // Tell Express to use the handlebars template engine for rendering HTML files with .hbs extension
// app.set("view engine", ".hbs");
// app.set('views', join(process.cwd(), 'src', 'views'));

// // /* This is a middleware function that will be executed before any other route handler */
// app.use(express.static(join(process.cwd(), '/public')));


// app.use('/api/products', productsRoutes);

// app.use('/api/carts', cartRoutes);

// app.use('/realtimeproducts', RealtimeProductsRoutes(io))

// // try {
// //     const products = JSON.parse(await productManager.getProducts());

// // } catch (error) {
// //     console.log(error)
// // }

// io.on('connection', (socket) => {
//     console.log('Socket conectado')
//     socket.on('message', data => {
//         console.log(`Mensaje recibido ${data}`)
//     }
//     )

//     socket.on('productAdded', (productData) => {
//         // Broadcast the product data to all connected clients
//         io.emit('productAdded', productData);
//     });

// })

// mongoose.connect('mongodb+srv://haiandonofrio:slaxhoxBCIXVyDqc@coderclusterecommerce.qi4zh4m.mongodb.net/'), (error) => {
//     if (error) {
//         console.log(`No se pudo conectar con la DB ${error}`)
//         process.exit()
//     }
// }
// // Start the Socket server
// app.listen(port, () => {
//     console.log(`Server is running on port ${port}`);
// });

// // app.listen(port, () => {
// //     console.log(`Server is running on port ${port}`);
// // });

