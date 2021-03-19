const jwt         = require('jsonwebtoken'),
      message     = "Something went wrong, try again",
      upload      = require('../config/multer'),
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
                req.token = decoded  //token added in the request process

                return next();
            })
        }
        catch (err) {
            return res.status(401).json({
                auth      : false,
                statuscode: 401,
                message   : 'Failed to authenticate'
            });
        }
    },

    uploadImg: (req, res, next) => {
        try {
            var singleUpload = upload.single('file');

            singleUpload(req, res, (err, data) => {
                if (err) {
                    logger.error("error occur in uploadImg utility callback", err)
                    return res.status(404).json({ message: "Something went wrong", statuscode: 404 })
                }
                else {
                    if (req.optional && (req.file === undefined)) {
                        return next()
                    } else if (req.file === undefined) {
                        logger.error("error occur in uploadImg utility in if condi undefined")
                        return res.status(400).send({
                            success   : false,
                            statuscode: 400,
                            message   : req.fileValidationError
                        });
                    }
                    req.s3url = req.file.location
                    return next();
                }
            })
        } catch (err) {
            logger.error("error occur in uploadImg utility catch block", err)
            return res.status(404).json({ message: "Something went wrong", statuscode: 404 })
        }
    },
}