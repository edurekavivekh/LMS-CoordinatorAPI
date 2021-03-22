var model           = require('../model'),
    { uploadS3Img } = require('../../config/multer'),
    { deleteImg }   = require('../../utility'),
    message         = "Something went wrong";

module.exports = {
    createCoordinator(coordinatorData, callback) {
        try {
            model.findCoordinator({ emailId: coordinatorData.emailId }, (err, result) => {
                if (err) {
                    logger.error("error occur in createCoordinator service find query callback")
                    return callback({ message: message, statuscode: 400 }, null)
                } else {
                    let filename = coordinatorData.profileImg;
                    if (result.length === 0) {
                        uploadS3Img(coordinatorData.profileImg, (err, data) => {
                            if (err) {
                                logger.error("error occur while uploading user img in createCoordinator service")
                                return callback({ message: message, statuscode: 400 }, null)
                            }
                            if (data) {
                                coordinatorData.profileImg = data;
                                deleteImg(filename)
                            }
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
                        })
                    } else {
                        filename !== null ? deleteImg(filename) : null;
                        return callback(null, {
                            message   : `[${result[0].emailId}] user already exist`,
                            statuscode: 409
                        })
                    }
                }
            })
        } catch (err) {
            logger.error("error occur in createCoordinator service catch block")
            return callback({ message: message, statuscode: 404 }, null)
        }
    },

    getCoordinators(_coordinatorData, callback) {
        try {
            model.findCoordinator({ isDeleted: false }, (err, result) => {
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
            model.findCoordinator({ $and: [{ _id: coordinatorData.coordinatorId }, { isDeleted: false }] }, (err, result) => {
                if (err) {
                    logger.error("error occur in updateCoordinator service find query callback")
                    return callback({ message: message, statuscode: 400 }, null)
                } else {
                    if (result.length !== 0) {
                        let keys     = Object.keys(coordinatorData.data);
                        let filename = keys.includes("profileImg") ? coordinatorData.data["profileImg"] : null;
                        uploadS3Img(filename, (err, data) => {
                            if (err) {
                                logger.error("error occur while uploading user img in createCoordinator service")
                                return callback({ message: message, statuscode: 400 }, null)
                            }
                            if (data) {
                                deleteImg(filename)
                                coordinatorData.data["profileImg"] = data;
                            }
                            model.updateCoordinator(coordinatorData, (err, result) => {
                                if (err) {
                                    logger.error("error occur in updateCoordinator service callback")
                                    return callback({ message: message, statuscode: 400 }, null)
                                }
                                let msg = result.isDeleted ? 'Removed successfully' : `Updated successfully`;
                                return callback(null, {
                                    message   : msg,
                                    statuscode: 200
                                })
                            })
                        })
                    } else {
                        return callback(null, {
                            message   : `No [${coordinatorData.coordinatorId}] user found`,
                            statuscode: 404
                        })
                    }
                }
            })
        } catch (err) {
            logger.error("error occur in updateCoordinator service catch block")
            return callback({ message: message, statuscode: 404 }, null)
        }
    },
}