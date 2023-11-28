'use strict'

import express, { json } from 'express';
import session from 'express-session';
import { createServer } from 'node:http';
import { join } from 'node:path';
import { Server } from 'socket.io';
import { engine } from 'express-handlebars';
import { router } from './routes/index.js';
import { db, storage } from './database.js';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import cors from 'cors';
import initializedPassport from './controller/passportController.js';
import passport from 'passport'

const server = express()
const serverIo = createServer(server)
const io = new Server(serverIo)
const swaggerDocument = YAML.load('./openapi.yml')
server.use(json())
server.use(cors())


server.use(cookieParser('1234'))


server.engine('.hbs', engine({
    extname: '.hbs',
    defaultLayout: 'main'
}))

server.set("view engine", ".hbs");
server.set('views', join(process.cwd(), 'src', 'views'));
server.use(express.static(join(process.cwd(), '/public')));

server.use(session(storage))

initializedPassport()
server.use(passport.initialize())
server.use(passport.session())

server.use('/api-doc', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
server.use('/api', router)


function shutdown(message, code) {
    console.log(`Server ${code ? `${message}: ${code}` : 'stopped'}`)
}

process.on('exit', code => shutdown('About to exit with', code))

export default server