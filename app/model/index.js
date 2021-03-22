module.exports = {
    // coordinator
    createCoordinator: require('./coordinatorModel').create,
    getCoordinator   : require('./coordinatorModel').get,
    findCoordinator  : require('./coordinatorModel').find,
    updateCoordinator: require('./coordinatorModel').update,
    removeCoordinator: require('./coordinatorModel').remove,
}