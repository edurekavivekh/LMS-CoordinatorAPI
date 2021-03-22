module.exports = {
    // coordinator
    createCoordinator  : require('./coordinatorController').createCoordinator,
    getCoordinators    : require('./coordinatorController').getCoordinators,
    getCoordinatorsList: require('./coordinatorController').getCoordinatorsList,
    updateCoordinator  : require('./coordinatorController').updateCoordinator,
    removeCoordinator  : require('./coordinatorController').removeCoordinator,
}