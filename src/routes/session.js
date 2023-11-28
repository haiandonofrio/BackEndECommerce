'use strict'

import express from 'express';
import passport from 'passport';
import { registerUser, loginUser, logoutUser, restorePassword } from "../controller/sessionController.js";

const router = express.Router()
router.use(express.json())
router.use(express.urlencoded({ extended: true }))

router.get('/github', passport.authenticate('github', { scope: ['user: email'] }),
    async (req, res) => {
        console.log('Existe usuario')
    })

router.get('/githubCallback', passport.authenticate('github', { failureRedirect: '/failLogin' }), async (req, res, next) => {
    req.session.user = req.user
    res.redirect('/api/product')
})

router.post('/register', passport.authenticate('register', {
    failureRedirect: '/failregister'
}), async (req, res) => {

    res.send({ status: "success", message: "User registered" });
})

router.get('/failregister', async (req, res) => {
    res.send({ error: 'failed' })
})

router.post('/login', passport.authenticate('login', {
    failureRedirect: '/failLogin'
}), async (req, res) => {
    const { email, password } = req.body
    if (!req.user) return res.status(400).send({ status: "error", error: "Incomplete Values" });

    req.session.user = {
        first_name: req.user.first_name
    }

    res.send({ status: "success", payload: req.user });
})

router.get('/failLogin', async (req, res) => {
    res.send({ error: 'failed' })
})

router.delete('/logout', logoutUser)

router.post('/restore', restorePassword)

// Reemplazados por estrategia de Passport
// router.post('/login', loginUser)

// router.post('/register', registerUser)

export { router };