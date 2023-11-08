'use strict'

import { Router } from 'express'
import { dirname, join } from 'node:path'
import { readdirSync, existsSync } from 'node:fs'
import { removeExtensionFilename } from '../utils/helpers.js'

const router = Router()

const PATH_ROUTES = dirname(`${import.meta.url}`).split('file://')[1]

const path = join(process.cwd(), '/src/routes')

if (existsSync(path)) {
    readdirSync(path).filter(filename => {
        const routerFilename = removeExtensionFilename(filename)
        if (routerFilename != 'index') {
            import(`./${routerFilename}.js`).then(routerModule => {
                router.use(`/${routerFilename}`, routerModule.router)
            })
        }
    })
} else {
    console.error(`Directory does not exist: ${path}`);
}

export { router };