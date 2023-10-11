import express from 'express';

const router = express.Router();

// Ruta para renderizar la vista "realTimeProducts.handlebars"
router.get('/realtimeproducts', (req, res) => {
    // Renderiza la vista "realTimeProducts.handlebars"
    res.render('realTimeProducts');
});

router.use(express.json());
router.use(express.urlencoded({ extended: true }));
export default router;
