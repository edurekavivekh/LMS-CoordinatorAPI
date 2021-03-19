var model   = require('../model'),
    message = "Something went wrong";

module.exports = {
    createCoordinator(coordinatorData, callback) {
        try {
            model.findCoordinator({ emailId: coordinatorData.emailId }, (err, result) => {
                if (err) {
                    logger.error("error occur in createCoordinator service find query callback")
                    return callback({ message: message, statuscode: 400 }, null)
                } else {
                    return result.length == 0 ?
                        model.createCoordinator(coordinatorData, (err, result) => {
                            if (err) {
                                logger.error("error occur in createCoordinator service callback")
                                return callback({ message: message, statuscode: 400 }, null)
                            }
                            return callback(null, {
                                message   : `Created successfully`,
                                statuscode: 201
                            })
                        })
                        : 
                        callback(null, {
                            message   : `[${result[0].emailId}] user already exist`,
                            statuscode: 409
                        })
                }
            })
        } catch (err) {
            logger.error("error occur in createCoordinator service catch block")
            return callback({ message: message, statuscode: 404 }, null)
        }
    },

    getCoordinators(coordinatorData, callback) {
        try {
            model.findCoordinator(coordinatorData, (err, result) => {
                if (err) {
                    logger.error("error occur in getCoordinators service callback")
                    return callback({ message: message, statuscode: 400 }, null)
                }
                return callback(null, {
                    message   : `Successfully fetched all coordinators`,
                    statuscode: 201,
                    result    : result
                })
            })
        } catch (err) {
            logger.error("error occur in getCoordinators service catch block")
            return callback({ message: message, statuscode: 404 }, null)
        }
    },

    updateCoordinator(coordinatorData, callback) {
        try {
            model.findCoordinator({ _id: coordinatorData.coordinatorId }, (err, result) => {
                if (err) {
                    logger.error("error occur in updateCoordinator service find query callback")
                    return callback({ message: message, statuscode: 400 }, null)
                } else {
                    return result.length !== 0 ?
                        model.updateCoordinator(coordinatorData, (err, result) => {
                            if (err) {
                                logger.error("error occur in updateCoordinator service callback")
                                return callback({ message: message, statuscode: 400 }, null)
                            }
                            return callback(null, {
                                message   : `Updated successfully`,
                                statuscode: 200
                            })
                        })
                        : 
                        callback(null, {
                            message   : `No [${coordinatorData.coordinatorId}] user found`,
                            statuscode: 404
                        })
                }
            })
        } catch (err) {
            logger.error("error occur in updateCoordinator service catch block")
            return callback({ message: message, statuscode: 404 }, null)
        }
    },

    removeCoordinator(coordinatorData, callback) {
        try {
            model.findCoordinator({ _id: coordinatorData.coordinatorId }, (err, result) => {
                if (err) {
                    logger.error("error occur in removeCoordinator service find query callback")
                    return callback({ message: message, statuscode: 400 }, null)
                } else {
                    return result.length !== 0 ?
                        model.removeCoordinator({ _id: coordinatorData.coordinatorId }, (err, result) => {
                            if (err) {
                                logger.error("error occur in removeCoordinator service callback")
                                return callback({ message: message, statuscode: 400 }, null)
                            }
                            return callback(null, {
                                message   : `Removed successfully`,
                                statuscode: 200
                            })
                        })
                        : 
                        callback(null, {
                            message   : `No [${coordinatorData.coordinatorId}] user found`,
                            statuscode: 404
                        })
                }
            })
        } catch (err) {
            logger.error("error occur in removeCoordinator service catch block")
            return callback({ message: message, statuscode: 404 }, null)
        }
    },
}