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
import passport from 'passport';
import fs from 'fs';
import { loggerDev, logTestErrorsdev } from './commons/loggerDev.js'
import { loggerProD, logTestErrorsPro } from './commons/logerProd.js'

const errorLogStream = fs.createWriteStream('logs/error.log', { flags: 'a' });
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

// Middleware to log errors to the 'error.log' file

server.use((err, req, res, next) => {
  loggerProD.error(err.stack); // Using the production logger for error logs
  errorLogStream.write(`${new Date().toISOString()} - ${err.stack}\n`);
  next(err);
});

// server.use(passport.session())
server.get('/loggerTest', (req, res) => {
  try {
    // Simulate an error for testing
    logTestErrorsdev();
    // logTestErrorsPro();
    // throw new Info('This is a test error');
  } catch (error) {
    // Log the error using the appropriate logger based on environment
    const logger = process.env.NODE_ENV === 'production' ? loggerProD : loggerDev;
    logger.error('Error here'); // Replace this line with the desired error message
    logger.error(error.message);
    res.status(500).send('Internal Server Errorjjjj');
  }
});

function shutdown(message, code) {
    console.log(`Server ${code ? `${message}: ${code}` : 'stopped'}`)
}

process.on('exit', code => shutdown('About to exit with', code))

export default server