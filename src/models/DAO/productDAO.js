import { ERROR } from '../../commons/errorMessages.js';
import { Product } from '../Models/productModel.js';

export class ProductDAO {
  async getProducts(filter, options) {
    const ProductDB = await Product.paginate(filter, options)
    return ProductDB;
  }

  async getProductsById(id) {
    const Products = await Product.findOne({ _id: id });
    return Products;
  }

  async deleteProduct(id, email) {
    // const Product = await Product.deleteOne({ _id: id }).lean();

    const productToDelete = await Product.findOne({ _id: id, owner: email });

    if (!productToDelete) {
      // If the product doesn't exist or the email doesn't match, return an error or handle it accordingly
      throw new Error(ERROR.ADMIN_ACTION_REQUIRED);
    }

    // Update the product only if the email matches
    const deletedProduct = await Product.deleteOne({ _id: id, owner: email })
    return deletedProduct;
  }


  async createProducts(payload) {
    const newProduct = await Product.create(payload);
    return newProduct;
  }

  async updateProducts(id, payload, email,role) {
    const productToUpdate = await Product.findOne({ _id: id, owner: email });

    if (!productToUpdate && role != 'ADMIN') {
      // If the product doesn't exist or the email doesn't match, return an error or handle it accordingly
      throw new Error(ERROR.ADMIN_ACTION_REQUIRED);
    }

    // Update the product only if the email matches
    const updatedProduct = await Product.updateOne({ _id: id, owner: email }, {
      $set: payload
    });

    return updatedProduct;
  }
}