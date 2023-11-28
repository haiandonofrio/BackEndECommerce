'use strict'

import jwt from 'jsonwebtoken';
import { config } from '../config.js'
const removeExtensionFilename = filename => filename.split('.').shift()

export { removeExtensionFilename }

export const generateToken = (user) => {
    const token = jwt.sign({ user }, config.PRIVATE_KEY, { expires: '1m' })
    return token;
}

export const authToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).send({ error: "Not Autthenticated" })

    const token = authHeader.split(' ')[1];
    jwt.verify(token, config.PRIVATE_KEY), (error, credentials) => {
        if (error) return res.status(403).send({ error: 'Not authorized' })

        req.user = credentials.user
        next()
    }
}

export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10)) // register

export const isValidPassword = (user, password) => bcrypt.compareSync(password, user.password) //  login 