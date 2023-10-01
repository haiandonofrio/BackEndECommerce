import express from 'express';
import productsRoutes from './routes/products.js'; 
import cartRoutes from './routes/cart.js'; 
const app = express();
const port = 8080; // Set your desired port number


app.use('/api/products', productsRoutes);


app.use('/api/carts', cartRoutes);

// Start the Express server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
