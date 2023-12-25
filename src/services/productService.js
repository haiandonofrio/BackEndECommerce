import { Product } from '../models/productModel.js'

class ProductService {
    static async getProducts(query) {
        try {
            const sortField = query.sort || 'price';
        const sortOrder = parseInt( query.order === 'desc' ? '-1' : '1');

            const currPage = parseInt( query.page) || 1;
            const qlimit = parseInt( query.limit, 10) || 3;;

            const { category, minStock } =  query; // Assuming query parameters for category and minStock

            const filter = {};
            if (category) {
                filter.category = category;
            }
            if (minStock) {
                filter.stock = { $gt: parseInt(minStock) || 0 };
            }

            const options = {
                page: currPage, // Page number
                limit: qlimit, // Number of documents per page

            };

            options.sort = { [sortField]: sortOrder };

            const results = await Product.paginate(filter, options)

            return results

        } catch (error) {
            throw new Error(error.message)
        }
    }

    static async saveProduct(product) {
        try {
            const newProduct = new Product({
                title: product.title,
                description:  product.description,
                price: parseFloat( product.price),
                thumbnails:  product.thumbnails,
                code:  product.code,
                stock:  product.stock,
                status:  product.status,
                category:  product.category,
            })

            const productSave = await newProduct.save()

            return productSave

        } catch (error) {
            throw new Error(error.message)
        }
    }

    static async getProductId(id) {
        try {

            const query = Product.where({ _id: id })

            const result = await query.findOne()

            return result

        } catch (error) {
            throw new Error(error.message)
        }
    }

    static async deleteProduct(id) {
        try {

            const result = await Product.deleteOne({ _id: id })

            return result

        } catch (error) {
            throw new Error(error.message)
        }
    }

    static async updateProduct(product) {
        try {
            const update = {
                title:  product.title,
                description:  product.description,
                price:  product.price,
                thumbnails:  product.thumbnails,
                code:  product.code,
                stock:  product.stock,
                status:  product.status,
                category:  product.category,
            }

            // `doc` is the document _after_ `update` was applied because of
            // `returnOriginal: false`
            const productUpdated = await Product.findOneAndUpdate(filter, update, {
                returnOriginal: false,
            })
            return productUpdated
        } catch (error) {
            throw new Error(error.message)
        }
    }
}
export default new ProductService();