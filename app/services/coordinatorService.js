var model = require('../model')
var message = "Something went wrong"

module.exports = {
    createCoordinator(coordinatorData, callback) {
        try {
            model.createCoordinator(coordinatorData, async (err, result) => {
                if (err) return callback({ message: message, statuscode: 400 }, null)
                else return callback(null, {
                    message: `Created successfully`,
                    result: result,
                    statuscode: 200
                })
            })
        } catch (err) {
            return callback({ message: message, statuscode: 404 }, null)
        }
    },
}