import express from 'express';

const router = express.Router();

// Import the ProductManager class
import { CartManager } from '../CartManager.js'; // Adjust the import path as needed

// Create an instance of the ProductManager class, specifying the path to the data file
const cartManager = new CartManager('cart.json'); // Specify the correct file path

// Middleware to parse JSON request bodies
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

// Create Cart
router.post('/', async (req, res) => {
    try {
        const Cart = await cartManager.addCart();

        res.status(201).json({ message: `Cart created successfully` });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get a Cart by ID
router.get('/:cid', async (req, res) => {
    const CartId = parseInt(req.params.cid, 10);
    if (isNaN(CartId)) {
        res.status(400).json({ error: 'Invalid ID' });
        return;
    }

    try {
        const Cart = await cartManager.getCartById(CartId);
        res.json(Cart);
    } catch (error) {
        if (error.message === cartManager.errors.ERROR_READING_FILE_ID) {
            res.status(404).json({ error: 'Product not found' });
        } else {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
});

// Create a new product or add products to Cart
router.post('/:cid/product/:pid', async (req, res) => {
    const CartId = parseInt(req.params.cid, 10);
    const ProductId = parseInt(req.params.pid, 10);

    try {
        cartManager.addProductToCart(CartId, ProductId);
        res.status(201).json({ message: 'Product added successfully' });
    } catch (error) {
        // if (error.message === 'El producto ya existe') {
        //     res.status(400).json({ error: 'Product already exists' });
        // } else {
        res.status(500).json({ error: 'Internal Server Error' });
        // }
    }
});


export default router;
