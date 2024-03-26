'use strict'

import jwt from 'jsonwebtoken';
import { config } from '../config.js'
import bcrypt from 'bcrypt'
import { Users } from '../models/Models/usersModel.js';

const removeExtensionFilename = filename => filename.split('.').shift()

export { removeExtensionFilename }

export const generateToken = (user) => {
  const token = jwt.sign({ user }, config.PRIVATE_KEY, { expiresIn: '24h' })
  return token;
}

export const verifyToken = (token) => {
  const secretKey = config.PRIVATE_KEY; // Replace with your secret key

  try {
    const decoded = jwt.verify(token, secretKey);
    return decoded.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const generateMailToken = (email) => {
  const secretKey = config.PRIVATE_KEY; // Replace with your secret key
  const expiresIn = 3600; // 1 hour in seconds

  const token = jwt.sign({ data: email }, secretKey, { expiresIn });

  return token;
};

export const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) { // si existe la cookie
    token = req.cookies['currentToken'];
  }

  return token;
};

export const checkUser = async (email, password) => {
  const userCheck = await Users.findOne({
    email
  }).exec();
  return userCheck

}
export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10)) // register

export const isValidPassword = (user, password) => bcrypt.compareSync(password, user.password) //  login 

export function generateUniqueCode(prefix = 'ORD') {
  const randomNumber = Math.floor(Math.random() * 10000); // Número aleatorio entre 0 y 9999
  const timestamp = new Date().getTime(); // Marca de tiempo en milisegundos

  // Concatenar el prefijo, el número aleatorio y la marca de tiempo para formar el código
  const code = `${prefix}-${randomNumber}-${timestamp}`;

  return code;
}

export function generateBody(body) {
  const htmlBody = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Confirmación de Compra</title>
    </head>
    <body>
        <div>
            <h2>Confirmación de Compra</h2>
            <p>Estimado/a Cliente,</p>
            <p>Gracias por su compra. A continuación, le proporcionamos los detalles de su pedido:</p>
            <table>
                <thead>
                    <tr>
                        <th>Código</th>
                        <th>Fecha</th>
                        <th>Monto Total</th>
                        <th>Comprador</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>${body.code}</td>
                        <td>${body.createdAt}</td>
                        <td>${body.amount}</td>
                        <td>${body.purchaser}</td>
                    </tr>
                </tbody>
            </table>
            <h3>Productos</h3>
            <ul>
                ${body.products.map(product => `<li>${product.quantity} x ${product.product}</li>`).join('')}
            </ul>
            <p>Gracias nuevamente por su compra.</p>
            <p>Saludos cordiales,</p>
            <p>Tu Tienda Online</p>
        </div>
    </body>
    </html>
`;
  return htmlBody
}