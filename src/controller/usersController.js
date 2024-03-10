'use strict'

import { Users } from "../models/Models/usersModel.js";
import userService from '../services/usersService.js';
import { config } from '../config.js';
import { createHash, generateMailToken, isValidPassword } from '../utils/helpers.js';
import { ERROR, SUCCESS } from "../commons/errorMessages.js";
import MailingService from "../services/mailing.js";

// Import SUCCESS object

export const getAllUsers = async (req, res) => {
    const users = await userService.getUsers();
    res.json(users);

}

export const deleteInactiveUsers = async (req, res) => {
    const time = 30 * 60 * 1000; // 30 minutes in milliseconds

    const users = await userService.deleteUsers(time);

    res.json(users);

}

export const sendRestorePassword = async (req, res) => {

    const token = generateMailToken(req.body.email)
    const mailer = new MailingService()
    const sendMailer = await mailer.sendMailUser({

        from: 'haian.donofrio@gmail.com',
        to: req.body.email,
        subject: 'Restaurar Contraseña',
        html: `<div>Click en el siguiente link para restaurar su contraseña: http://localhost:3000/api/views/restore/verify?token=${token}`

    })

    res.send({ status: 'success', message: SUCCESS.USER_REGISTERED });


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

    if (!role) {
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
            console.error(ERROR.SESSION_ERROR, err);
            res.status(500).send({ status: 'error', error: ERROR.SESSION_ERROR });
        } else {
            res.status(200).send({ status: 'success', message: SUCCESS.LOGOUT_SUCCESSFUL })
        }
    });
}

export const changeRole = async (req, res) => {

    const uid = req.params.uid;

    try {
        let user;

        user = await userService.getUser(uid);

        if (!user) {
            user = await userService.getId(uid);
            if (!user) {
                return res.status(404).json({ error: ERROR.USER_NOT_FOUND });
            }
        }

        if (user.role === 'USER') {
            user.role = 'PREMIUM';
        } else {
            user.role = 'USER';
        }

        await userService.updateUser(user.email, user);

        return res.json({ message: SUCCESS.USER_UPDATED, user });
    } catch (error) {
        console.error(ERROR.USER_NOT_UPDATED, error);
        return res.status(500).json({ error: ERROR.SERVER_ERROR });
    }
}

export const uploadFiles = async (req, res) => {
    try {
        // Extract user ID from request parameters
        const userId = req.params.uid;

        // Extract uploaded files from req.files
        const { ID, Address, Account_state } = req.files;

        // Update user's documents array based on uploaded files
        const user = await userService.getUser(userId);

        if (!user) {
            return res.status(404).send('User not found');
        }

        // Update user's documents array
        if (ID) {
            user.documents.push({ name: 'ID', reference: ID[0].filename });
        }
        if (Address) {
            user.documents.push({ name: 'Address', reference: Address[0].filename });
        }
        if (Account_state) {
            user.documents.push({ name: 'Account_state', reference: Account_state[0].filename });
        }

        // Save updated user document to the database
        const result = await userService.updateUser(userId, user);

        // Send a success response
        if (result) {
            res.send('Files uploaded successfully and user documents updated!');
        }
        
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
}
