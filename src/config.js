
const config = {
    PORT: process.env.PORT || 8080,
    ADMINEMAIL: process.env.ADMINEMAIL,
    ADMINPASS: process.env.ADMINPASS,
    MONGODB_URI: process.env.MONGODB_URI || "mongodb://localhost/test",
    PRIVATE_KEY: process.env.PRIVATE_KEY,
    GITHUB_AUTH_ID: process.env.GITHUB_AUTH_ID,
    GITHUB_SECRET: process.env.GITHUB_SECRET,
    MAIL_USER: process.env.MAIL_USER,
    MAIL_PASS: process.env.MAIL_PASS,
    MAIL_SERVICE: process.env.MAIL_SERVICE
}

export { config }