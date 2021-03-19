module.exports = {
    // coordinator
    createCoordinator: require('./coordinatorController').createCoordinator,
    getCoordinators: require('./coordinatorController').getCoordinators,
    updateCoordinator: require('./coordinatorController').updateCoordinator,
    removeCoordinator: require('./coordinatorController').removeCoordinator,
}