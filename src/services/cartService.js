import { Cart } from '../models/cartModel.js'

class cartService {
    static async getCarts() {
        try {
            const results = await Cart.find({}).select(['-__v']).populate('products.producto');
            return results

        } catch (error) {
            throw new Error(error.message)
        }
    }

    static async createCart() {
        try {
            const cart = new Cart({
                products: [],
            })

            const result = await cart.save()

            return result

        } catch (error) {
            throw new Error(error.message)
        }
    }

    static async getCartId(id) {
        try {

            const query = Cart.where({ _id: id })

            const result = await query.findOne().populate('products.producto');

            return result

        } catch (error) {
            throw new Error(error.message)
        }
    }

    static async deleteCart(id) {
        try {

            const result = await Cart.deleteOne({ _id: id }).populate('products.producto');

            return result

        } catch (error) {
            throw new Error(error.message)
        }
    }

    static async deleteProduct(product) {
        try {
            const cartId = product.cid;
            const productId = product.pid;

            // Buscar el carrito por su ID y actualizarlo
            const result = await Cart.findByIdAndUpdate(
                cartId,
                { $pull: { products: { producto: productId } } },
                { new: true }
            ).populate('products.producto');
            return result
        } catch (error) {
            throw new Error(error.message)
        }
    }

    static async addProduct(product, quantity) {
        try {

            const { cid, pid } = product.params;
            const cart = await Cart.findOneAndUpdate(
                { _id: cid, 'products.producto': pid },
                { $inc: { 'products.$.quantity': quantity || 1 } },
                { new: true } // Return the modified document
            ).populate('products.producto');

            if (!cart) {
                const newCart = {
                    producto: pid,
                    quantity: quantity || 1
                };
                const result = await Cart.findOneAndUpdate({
                    _id: cid
                },
                    { $push: { products: newCart } },
                    { new: true } // Return the modified document
                ).populate('products.producto');
                return result
            } else {
                return cart
            }
        } catch (error) {
            throw new Error(error.message)
        }
    }

    static async updateProduct(products, cartId) {
        try {

            if (!Array.isArray(products)) {
                return res.status(400).json({
                    status: 'error',
                    message: 'La propiedad "products" debe ser un arreglo.',
                });
            }

            // 2. Buscar el carrito por ID
            const existingCart = await Cart.findById(cartId);

            if (!existingCart) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Carrito no encontrado.',
                });
            }

            // 3. Actualizar el carrito
            existingCart.products = products;
            const result = await existingCart.save();
            return result
        } catch (error) {
            throw new Error(error.message)
        }
    }
}
export default new cartService();