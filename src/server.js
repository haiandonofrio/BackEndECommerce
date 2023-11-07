'use strict'

import express, { json } from 'express';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import cors from 'cors'

const server = express()
const swaggerDocument = YAML.load('./openapi.yml')
server.use(json())
server.use(cors())

server.use('/api-doc', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

function shutdown(message, code) {
    console.log(`Server ${code ? `${message}: ${code}` : 'stopped'}`)
}

process.on('exit', code => shutdown('About to exit with', code))

export default server