
const jwt = require('jsonwebtoken');
const config = require('../config');

const verifyFn = {
    verifyToken: function (req, res, next) {
        // retrieve content of authorization in req.header
        const authHeader = req.headers['authorization'];

        // if auth Header does not exists or word Bearer is not found in authHeader
        if (!authHeader || !authHeader.includes('Bearer')) {
            res.status(403);
            return res.send({ auth: false, message: 'Not authorized!' });
        }
        else {
            // retrieve token
            const token = authHeader.split('Bearer ')[1]; //obtain the token's value
            // verify token
            jwt.verify(token, config.key, function (err, payload) {
                // token does not match
                if (err) {
                    res.status(403);
                    return res.send({ auth: false, message: 'Not authorized!' });
                }
                else {
                    req.body.payload = payload;
                    next();
                }
            })
        }
    },

    verifyAdmin: function (req, res, next) {
        const role = req.body.payload.role;

        if (role == 'admin') {
            next();
        }
        else {
            res.status(403);
            return res.send({ auth: false, message: 'not an admin' });
        }
    }
}


module.exports = verifyFn;