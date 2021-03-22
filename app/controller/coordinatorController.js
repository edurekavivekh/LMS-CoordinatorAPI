const services = require('../services');

module.exports = {
    createCoordinator(req, res, next) {
        try {
            var coordinatorData = {
                name      : req.body.name,
                mobile    : req.body.mobile,
                emailId   : req.body.emailId,
                profileImg: req.file || null,
                createdBy : req.token.jti
            },
                response = {};

            services.createCoordinator(coordinatorData, (err, result) => {
                if (err) {
                    response.success    = false
                    response.statuscode = err.statuscode
                    response.message    = err.message
                    logger.error("error occur in createCoordinator controller callback")
                    return res.status(err.statuscode).send(response)
                } else {
                    response.success    = true
                    response.statuscode = result.statuscode
                    response.message    = result.message

                    return res.status(result.statuscode).send(response)
                }
            })
        } catch (err) {
            logger.error("error occur in createCoordinator controller catch block")
            next(err)
        }
    },

    getCoordinators(req, res, next) {
        try {
            var coordinatorData = {
                query  : { isDeleted: false },
                project: {}
            },
                response = {};

            services.getCoordinators(coordinatorData, (err, result) => {
                if (err) {
                    response.success    = false
                    response.statuscode = err.statuscode
                    response.message    = err.message
                    logger.error("error occur in getCoordinators controller callback")
                    return res.status(err.statuscode).send(response)
                } else {
                    response.success    = true
                    response.statuscode = result.statuscode
                    response.message    = result.message
                    response.result     = result.result

                    return res.status(result.statuscode).send(response)
                }
            })
        } catch (err) {
            logger.error("error occur in getCoordinators controller catch block")
            next(err)
        }
    },

    getCoordinatorsList(req, res, next) {
        try {
            var coordinatorData = {
                query  : { isDeleted: false },
                project: { "_id": 1, "name": 1 }
            },
                response = {};

            services.getCoordinators(coordinatorData, (err, result) => {
                if (err) {
                    response.success    = false
                    response.statuscode = err.statuscode
                    response.message    = err.message
                    logger.error("error occur in getCoordinators controller callback")
                    return res.status(err.statuscode).send(response)
                } else {
                    response.success    = true
                    response.statuscode = result.statuscode
                    response.message    = result.message
                    response.result     = result.result

                    return res.status(result.statuscode).send(response)
                }
            })
        } catch (err) {
            logger.error("error occur in getCoordinators controller catch block")
            next(err)
        }
    },

    updateCoordinator(req, res, next) {
        try {
            var coordinatorData = {
                userId       : req.token.jti,
                coordinatorId: req.params.coordinatorId,
                data         : {}
            },
                response = {};

            let keys = Object.keys(req.body);
            for (var i = 0; i < keys.length; i++) {
                coordinatorData.data[keys[i]] = req.body[keys[i]]
            }

            if (req.file) coordinatorData.data["profileImg"] = req.file;

            services.updateCoordinator(coordinatorData, (err, result) => {
                if (err) {
                    response.success    = false
                    response.statuscode = err.statuscode
                    response.message    = err.message
                    logger.error("error occur in updateCoordinator controller callback")
                    return res.status(err.statuscode).send(response)
                } else {
                    response.success    = true
                    response.statuscode = result.statuscode
                    response.message    = result.message

                    return res.status(result.statuscode).send(response)
                }
            })
        } catch (err) {
            logger.error("error occur in updateCoordinator controller catch block")
            next(err)
        }
    },

    removeCoordinator(req, res, next) {
        try {
            var coordinatorData = {
                userId       : req.token.jti,
                coordinatorId: req.params.coordinatorId,
                data         : { isDeleted: true }
            },
                response = {};

            services.updateCoordinator(coordinatorData, (err, result) => {
                if (err) {
                    response.success    = false
                    response.statuscode = err.statuscode
                    response.message    = err.message
                    logger.error("error occur in removeCoordinator controller callback")
                    return res.status(err.statuscode).send(response)
                } else {
                    response.success    = true
                    response.statuscode = result.statuscode
                    response.message    = result.message

                    return res.status(result.statuscode).send(response)
                }
            })
        } catch (err) {
            logger.error("error occur in removeCoordinator controller catch block")
            next(err)
        }
    },
}