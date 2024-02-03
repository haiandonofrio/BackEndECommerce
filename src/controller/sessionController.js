'use strict'

import { Users } from "../models/Models/usersModel.js";
import userService from '../services/sessionService.js';
import { config } from '../config.js';
import { createHash, generateMailToken, isValidPassword } from '../utils/helpers.js';
import { ERROR, SUCCESS } from "../commons/errorMessages.js";
import MailingService from "../services/mailing.js";

// Import SUCCESS object

export const sendRestorePassword = async (req,res) => {

    const token = generateMailToken(req.body.email)
    const mailer = new MailingService()
    const sendMailer = await mailer.sendMailUser({

        from:'coderprofeandrea@gmail.com',
        to: req.body.email,
        subject: 'Restaurar Contraseña',
        html: `<div>Click en el siguiente link para restaurar su contraseña: http://localhost:3000/api/views/restore/verify?token=${token}`

    })

    res.send({ status: 'success', message: "Usuario registrado en el curso"})


}

export const restorePassword = async (req, res) => {
    const { email, password } = req.body;
    const existingUser = await Users.findOne({ email });

    if (!existingUser) {
        return res.status(404).send({ status: 'error', error: ERROR.USER_NOT_FOUND });
    }

    // Check if the new password is the same as the existing hashed password
    if (isValidPassword(existingUser, password)) {
        return res.status(400).send({ status: 'error', error: ERROR.SAME_PASSWORD });
    }

    const hashedPassword = createHash(password);

    const updatedUser = await Users.findOneAndUpdate(
        { email: email },
        { $set: { 'password': hashedPassword } },
        { new: true }
    );

    res.send({ status: 'success', message: SUCCESS.PASSWORD_RESTORED });
};

export const registerUser = async (req, res) => {
    const { first_name, last_name, email, age, password, role } = req.body
    const existe = userService.getUser(email)

    if(!role) {
    let defaultRole;
    if (email === config.ADMINEMAIL && password === config.ADMINPASS) {
        defaultRole = 'ADMIN'
    } else {
        defaultRole = 'USER'
    }
    role = defaultRole;
    }

    const hashedPassword = createHash(password)
    if (existe) return res.status(400).send({ status: 'error', error: ERROR.USER_ALREADY_EXISTS })

    const user = {
        first_name,
        last_name,
        email,
        age,
        hashedPassword,
        role
    }
    let result = await Users.create(user)

    res.send({ status: 'success', message: SUCCESS.USER_REGISTERED })
}

export const loginUser = async (req, res) => {
    const { email, password } = req.body
    const user = userService.getUser(email)

    if (!user) return res.status(400).send({ status: 'error', error: ERROR.ERROR_CREDENTIALS })

    if (!isValidPassword(user, password)) if (!user) return res.status(403).send({ status: "error", error: ERROR.INCORRECT_PASSWORD });

    req.session.user = {
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        age: user.age,
        role: user.role
    }
    res.send({ status: 'success', payload: req.session.user, message: SUCCESS.FIRST_LOGIN })
}

export const logoutUser = async (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Error destroying session:', err);
            res.status(500).send({ status: 'error', error: ERROR.SESSION_ERROR });
        } else {
            res.status(200).send({ status: 'success', message: SUCCESS.LOGOUT_SUCCESSFUL })
        }
    });
}
