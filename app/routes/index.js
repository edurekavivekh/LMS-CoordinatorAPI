var express = require('express'),
    routes = express.Router(),
    {
        verifyToken,
        storeImg,
        checkUserAlreadyExist
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
routes.post('/coordinator/create'
    , verifyToken
    , storeImg
    , val_user(false)
    , validate
    , checkUserAlreadyExist
    , controller.createCoordinator);

routes.get('/coordinator/all-coordinators'
    , validate
    , verifyToken
    , controller.getCoordinators);

routes.get('/coordinator/name-list'
    , validate
    , verifyToken
    , controller.getCoordinatorsList);

routes.put('/coordinator/:coordinatorId'
    , verifyToken
    , storeImg
    , val_user(true)
    , validate
    , checkUserAlreadyExist
    , controller.updateCoordinator);

routes.put('/coordinator/remove/:coordinatorId'
    , val_objectId('coordinatorId')
    , validate
    , verifyToken
    , controller.removeCoordinator);

module.exports = routes;