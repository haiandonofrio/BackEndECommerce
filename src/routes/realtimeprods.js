import express from 'express';

const router = express.Router();

// Import the ProductManager class
import { ProductManager } from '../ProductManager.js'; // Adjust the import path as needed

// Create an instance of the ProductManager class, specifying the path to the data file
const productManager = new ProductManager('products.json'); // Specify the correct file path

// Middleware to parse JSON request bodies
router.use(express.json());
router.use(express.urlencoded({ extended: true }));




// Get all products
router.get('/', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        const prodsRender = JSON.parse(products)
        const limit = parseInt(req.query.limit, 10);
        if (!isNaN(limit)) {
            res.render('realTimeProducts', { prodsRender });


            // res.json(JSON.parse(products.slice(0, limit)))
        } else {
            res.render('realTimeProducts', { prodsRender });
            // res.json(JSON.parse(products));
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }

    router.post('/product', (req, res) => {
        const { title, description, price, stock, thumbnails, status, code, category } = req.body
        try {
            productManager.addProduct(title, description, price, thumbnails, code, stock, status, category);
            res.send('Producto Creado')
        } catch (error) {
            if (error.message === 'El producto ya existe') {
                res.status(400).json({ error: 'Product already exists' });
            } else {
                res.status(500).json({ error: 'Internal Server Error' });
            }
        }

    })
});

// // Ruta para renderizar la vista "realTimeProducts.handlebars"
// router.get('/realtimeproducts', (req, res) => {
//     // Renderiza la vista "realTimeProducts.handlebars"
//     res.render('realTimeProducts');
// });


export default router;
