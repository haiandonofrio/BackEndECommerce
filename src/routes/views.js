'use strict'

import { Router } from "express";
import { verifyTokenMiddleware } from "../middlewares/restoreLinkAuth.js";

const router = Router()

router.get('/register', (req, res) => {
    res.render('register')
})

router.get('/login', (req, res) => {
    res.render('login')
})

router.get('/sendrestore', (req, res) => {
    res.render('sendrestore')
})

router.get('/restore', verifyTokenMiddleware, (req, res) => {

    res.render('restore')
})

router.get('/', (req, res) => {
    res.render('profile', {
        user: req.session.user
    })
})

router.get('/', (req, res) => {
    res.render('documents', {
        user: req.session.user
    })
})

app.get('/userAdmin', (req, res) => {
    if (req.session.user.role === 'ADMIN') {
        res.render('userAdmin');
    } else {
        res.status(500).send('Only admin');
    }

});

app.post('/user', async (req, res) => {
    const { email } = req.body;
    try {
        const user = await Users.findOne({ email });
        res.render('user', { user });
    } catch (error) {
        console.error('Error occurred while fetching user:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/user/update-role', async (req, res) => {
    const { email, role } = req.body;
    try {
        await Users.updateOne({ email }, { $set: { role } });
        res.redirect('/api/views/user');
    } catch (error) {
        console.error('Error occurred while updating user role:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/delete-user', async (req, res) => {
    const { email } = req.body;
    try {
        await Users.deleteOne({ email });
        res.redirect('/api/views/user');
    } catch (error) {
        console.error('Error occurred while deleting user:', error);
        res.status(500).send('Internal Server Error');
    }
});

export { router };