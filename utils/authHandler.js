let userController = require('../controllers/users')
let jwt = require('jsonwebtoken')
const path = require('path')
const { loadPemKey } = require('./keyLoader')

function getPublicKey() {
    return loadPemKey({
        envName: 'JWT_PUBLIC_KEY',
        filePath: path.join(__dirname, '..', 'keys', 'public.pem'),
        label: 'JWT public key'
    })
}

function extractToken(header) {
    if (!header) return null;
    if (header.startsWith('Bearer ')) {
        return header.slice(7).trim();
    }
    return header.trim();
}
module.exports = {
    CheckLogin: async function (req, res, next) {
        try {
            let token = extractToken(req.headers.authorization);
            if (!token) {
                res.status(401).send({
                    message: "ban chua dang nhap"
                })
                return;
            }
            let result = jwt.verify(token, getPublicKey(), {
                algorithms: ['RS256']
            })
            let user = await userController.GetAnUserById(result.id);
            if (!user) {
                res.status(401).send({
                    message: "ban chua dang nhap"
                })
                return;
            }
            req.user = user;
            next()
        } catch (error) {
            res.status(401).send({
                message: "ban chua dang nhap"
            })
        }
    }
}
