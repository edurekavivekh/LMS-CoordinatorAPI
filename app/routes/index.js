var express = require('express'),
    routes = express.Router(),
    {
        verifyToken,
    } = require('../../utility'),
    controller = require('../controller'),
    {
        val_user,
    } = require('../../config/validator'),
    validate = require('../middleware/validate').validate;

/**
 * Register API's
 */
// coordinator
routes.post('/lms-coordinator/create'
    , val_user
    , validate
    , verifyToken
    , controller.createCoordinator);

module.exports = routes;