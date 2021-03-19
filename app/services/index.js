module.exports = {
    // coordinator
    createCoordinator: require('./coordinatorService').createCoordinator,
    getCoordinators: require('./coordinatorService').getCoordinators,
    updateCoordinator: require('./coordinatorService').updateCoordinator,
    removeCoordinator: require('./coordinatorService').removeCoordinator,
}