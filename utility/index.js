const jwt = require('jsonwebtoken'),
    message = "Something went wrong, try again",
    fs = require('fs'),
    model = require('../app/model'),
    { upload } = require('../config/multer'),
    config = require('../config').get(),
    { s3ImagesLocal } = config.awsCredentials,
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
                auth: false,
                statuscode: 401,
                message: 'Failed to authenticate'
            });
        }
    },

    storeImg: (req, res, next) => {
        var singleUpload = upload.single('file');

        singleUpload(req, res, (err, data) => {
            if (err) {
                logger.error("error occur in uploadImg utility callback", err.message)
                return res.status(400).json({ message: err.message, statuscode: 400 })
            }

            if ([undefined, "", null].includes(req.file)) {
                return next();
            }
            req.file = req.file.filename
            next();
        })
    },

    deleteImg: deleteImg,

    checkUserAlreadyExist: (req, res, next) => {
        let queryObj = [];
        let keys = Object.keys(req.body);
        for (var i = 0; i < keys.length; i++) {
            let obj = {};
            if (["mobile", "emailId"].includes(keys[i])) {
                obj[keys[i]] = req.body[keys[i]];
                queryObj.push(obj);
            }
            continue;
        }
        if (req.body.mobile || req.body.emailId) {
            model.findCoordinator({ $or: queryObj }, (err, data) => {
                if (err) {
                    logger.error("error occur in checkUserAlreadyExist middleaware find query callback")
                    return res.status(400).send({ message: "Something went wrong", statuscode: 400 })
                }
                if (data.length !== 0) {
                    let val = data[0].mobile === Number(req.body.mobile) ? req.body.mobile : req.body.emailId;
                    [undefined, "", null].includes(req.file) ? null : deleteImg(req.file);
                    return res.status(409).send({
                        message: `[${val}] already exist`,
                        statuscode: 409
                    })
                } else return next()
            })
        } else return next()
    }
}

function deleteImg(file) {    
    if (![undefined, "", null].includes(file)) {
        fs.unlink(`./${s3ImagesLocal}/${file}`, (err) => {
            if (err) logger.error("Failed to delete local image:" + err);
            else logger.info('Successfully deleted local image');
        });
    }
}