'use strict'

import { Router } from "express";

const router = Router()

router.get('/register', (req, res) => {
    console.log('pase1')
    res.render('register')
})

router.get('/login', (req, res) => {
    res.render('login')
})

router.get('/restore', (req, res) => {
    res.render('restore')
})

router.get('/', (req, res) => {
    res.render('profile', {
        user: req.session.user
    })
})

export { router };