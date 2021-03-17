const jwt = require('jsonwebtoken'),
    message = "Something went wrong, try again",
    unauthorize = { success: false, statuscode: 401, message: "Unauthorized user" };

module.exports = {
    generateToken: (payload) => {
        try {
            var token = jwt.sign(payload, process.env.TOKEN_SECRET, { algorithm: "HS256", expiresIn: process.env.TOKEN_LIFE });
            return { auth: true, message: "Token generated", token: token }
        }
        catch (err) {
            return { auth: false, message: message };
        }
    },

    verifyToken: (req, res, next) => {
        try {
            var token = req.headers['x-access-token'] || req.headers["token"] || req.params.token;
            if (!token) return res.status(401).send({ auth: false, statuscode: 401, message: 'No token provided.' });

            jwt.verify(token, new Buffer.from(process.env.TOKEN_SECRET, "base64"), { algorithms: ['HS256'], issuer: 'LMS' }, (err, decoded) => {
                if (err) { return res.status(401).json({ auth: false, statuscode: 401, message: 'Failed to authenticate..', error: err }); }
                req.token = decoded //token added in the request process

                return next();
            })
        }
        catch (err) {
            return res.status(401).json({
                auth: false,
                statuscode: 401,
                message: 'Failed to authenticate'
            });
        }
    },
}