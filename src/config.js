'use strict'

import dotenv from 'dotenv'

if (process.env.NODE_ENV !== 'production') {
    dotenv.config()
}

const config = {
    PORT: process.env.PORT || 3000,
    ADMINEMAIL: process.env.ADMINEMAIL,
    ADMINPASS: process.env.ADMINPASS,
    MONGODB_URI: process.env.MONGODB_URI || "mongodb://localhost/test",
    PRIVATE_KEY: process.env.PRIVATE_KEY,
}

export { config }