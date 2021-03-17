const services = require('../services');

module.exports = {
    createCoordinator(req, res, next) {
        try {
            var coordinatorData = {
                name: req.body.name,
                mobile: req.body.mobile,
                emailId: req.body.emailId,
                profileImg: req.body.profileImg,
                createdBy: req.token.jti
            },
                response = {};

            services.createCoordinator(coordinatorData, (err, result) => {
                if (err) {
                    response.success = false
                    response.statuscode = err.statuscode
                    response.message = err.message
                    logger.error("error occur in createCoordinator controller callback")
                    return res.status(err.statuscode).send(response)
                } else {
                    response.success = true
                    response.statuscode = result.statuscode
                    response.message = result.message

                    return res.status(result.statuscode).send(response)
                }
            })
        } catch (err) {
            logger.error("error occur in createCoordinator controller catch block")
            next(err)
        }
    },
}