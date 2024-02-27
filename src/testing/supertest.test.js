import chai from 'chai';
import supertest from 'supertest';
import { ERROR, SUCCESS } from '../commons/errorMessages.js'

const expect = chai.expect;
const requester = supertest('http://localhost:3000')

describe('Testing Ecommerce', () => {
    describe('Test de productos', () => {
        let productId;

        it('El endpoint POST /api/product debe crear un nuevo producto', async () => {
            const productData = {
                title: 'Producto de prueba',
                description: 'Descripcion del producto de prueba',
                price: 1300,
                thumbnails: 'producto.jpg',
                code: 'abc123',
                stock: 20,
                status: true,
                category: 'Test',
            };

            const response = await requester.post('/api/product').send(productData);
            expect(response.status).to.equal(201);
            expect(response.body).to.have.property('status', 'success');
            expect(response.body).to.have.property('message', 'Producto guardado exitosamente');
            expect(response.body).to.have.property('productSave');
            productId = response.body.productSave.id;
            console.log(productId);
        });

        it('El endpoint GET /api/product/:pid debe devolver el producto creado', async () => {
            const response = await requester.get(`/api/product/${productId}`);
            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('title', 'Producto de prueba');
            expect(response.body).to.have.property('price', 1300);
            // Agrega más expectativas según la estructura de tu respuesta
        });

        it('El endpoint PUT /api/product/:pid debe modificar el producto', async () => {
            const updatedProductData = {

                title: 'Producto modificado',
                price: 129.99,
                description: 'Descripción modificada del producto'
            };

            const response = await requester.put(`/api/product/${productId}`).send(updatedProductData);
            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('title', 'Producto modificado');
            expect(response.body).to.have.property('price', 129.99);
        });

        it('El endpoint DELETE /api/product/:pid debe borrar el nuevo producto', async () => {
            const response = await requester.delete(`/api/product/${productId}`);
            expect(response.status).to.equal(200);
        });
    });
    describe('Test de carrito', () => {
        let cartId;
        it('El endpoint POST /api/cart debe crear un nuevo carrito', async () => {
            const response = await requester.post('/api/cart');
            expect(response.status).to.equal(201);
            expect(response.body).to.have.property('cartSave');
            cartId = response.body.cartSave.id;
        });

        it('El endpoint GET /api/cart/:cid debe obtener el nuevo carrito', async () => {
            const response = await requester.get(`/api/cart/${cartId}`);
            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('_id', cartId);
            expect(response.body).to.have.property('products').that.is.an('array').that.is.empty;
            // Puedes agregar más expectativas según la estructura de tu respuesta
        });

        it('El endpoint POST /api/cart/:cid/products/:pid debe añadir un nuevo producto al carrito', async () => {
            const productId = '65554fff1aeb7c552815b279'; // ID del producto que deseas agregar al carrito

            const response = await requester.post(`/api/cart/${cartId}/products/${productId}`);
            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('message', SUCCESS.CART_UPDATED);
            // Puedes agregar más expectativas según la estructura de tu respuesta
        });

        it('El endpoint DELETE /api/cart/:cid/products/:pid debe borrar el nuevo carrito', async () => {
            const productId = '65554fff1aeb7c552815b279';
            const response = await requester.delete(`/api/cart/${cartId}/products/${productId}`);
            expect(response.status).to.equal(200);
        });
    });

});