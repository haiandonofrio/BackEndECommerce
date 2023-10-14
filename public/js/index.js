'use strict'

const socket = io()

window.addEventListener('DOMContentLoaded', _event => {
    socket.emit('message', 'Hola desde el cliente!')
})
