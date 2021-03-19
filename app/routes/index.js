var express = require('express'),
    routes = express.Router(),
    {
        verifyToken,
        uploadImg
    } = require('../../utility'),
    controller = require('../controller'),
    {
        val_user,
    } = require('../../config/validator'),
    validate = require('../middleware/validate').validate;

/**
 * Coordinator API's
 */
routes.post('/lms-coordinator/create'
    , uploadImg
    , val_user
    , validate
    , verifyToken
    , controller.createCoordinator);

routes.get('/lms-coordinator/get-all-coordinators'
    , validate
    , verifyToken
    , controller.getCoordinators);

module.exports = routes;