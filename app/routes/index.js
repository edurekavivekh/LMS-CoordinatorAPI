var express = require('express'),
    routes  = express.Router(),
    {
        verifyToken,
        uploadImg
    } = require('../../utility'),
    controller = require('../controller'),
    {
        val_user,
        val_objectId
    } = require('../../config/validator'),
    validate = require('../middleware/validate').validate;

/**
 * Coordinator API's
 */
routes.post('/lms-coordinator/create'
    , verifyToken
    , uploadImg
    , val_user(false)
    , validate
    , controller.createCoordinator);

routes.get('/lms-coordinator/get-all-coordinators'
    , validate
    , verifyToken
    , controller.getCoordinators);

routes.put('/lms-coordinator/update-coordinator/:coordinatorId'
    , val_user(true)
    , validate
    , verifyToken
    , controller.updateCoordinator);

routes.put('/lms-coordinator/remove-coordinator/:coordinatorId'
    , val_objectId('coordinatorId')
    , validate
    , verifyToken
    , controller.removeCoordinator);

module.exports = routes;