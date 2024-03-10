'use strict'

import { Users } from "../models/Models/usersModel.js";
import userService from '../services/usersService.js';
import { config } from '../config.js';
import { createHash, generateMailToken, isValidPassword } from '../utils/helpers.js';
import { ERROR, SUCCESS } from "../commons/errorMessages.js";
import MailingService from "../services/mailing.js";


class UserAdminController {
    async getUser(req, res) {
        const { email } = req.body;
        try {
            const user = await userService.getUser(email);
            res.render('user', { user });
        } catch (error) {
            console.error('Error occurred while fetching user:', error);
            res.status(500).send('Internal Server Error');
        }
    }

    async updateUserRole(req, res) {
        const { email, role } = req.body;
        try {
            const user = await userService.updateRole(email,role);
            if (user) {
                res.render('user', { user });
            }
        } catch (error) {
            console.error('Error occurred while updating user role:', error);
            res.status(500).send('Internal Server Error');
        }
    }

    async deleteUser(req, res) {
        const { email } = req.body;
        try {
            const user = await userService.delete(email);
            if (user) {
                res.redirect('/api/views/user');
            }
            
        } catch (error) {
            console.error('Error occurred while deleting user:', error);
            res.status(500).send('Internal Server Error');
        }
    }
}

module.exports = UserAdminController;
