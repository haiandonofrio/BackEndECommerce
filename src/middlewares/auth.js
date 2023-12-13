// import jwt from 'jsonwebtoken';
// import passportJwt from 'passport-jwt';
// import { cookieExtractor } from '../utils/helpers.js';
// import { config } from '../config.js'


// export const auth = (req, res, next) => {

//     const token = passportJwt.ExtractJwt.fromExtractors([cookieExtractor])
//     if (!token) {
//         return res.status(401).json({
//             error: 'Not authenticated'
//         });
//     }
//     jwt.verify(token, config.PRIVATE_KEY, (error, credentials) => {
//         if (error) {
//             return res.status(403).json({ error: 'Not authorized' });
//         }
//         req.user = credentials;
//         next();
//     });
// };

// export const authToken = (req, res, next) => {
//     const authHeader = req.headers.authorization;
//     if (!authHeader) return res.status(401).send({ error: "Not Autthenticated" })

//     const token = authHeader.split(' ')[1];
//     jwt.verify(token, config.PRIVATE_KEY), (error, credentials) => {
//         if (error) return res.status(403).send({ error: 'Not authorized' })

//         req.user = credentials.user
//         next()
//     }
// }