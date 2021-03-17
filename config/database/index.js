'use strict';

/**
 * @description Module dependencies
 */
module.exports = function (config) {
    if (typeof config.mongodb !== undefined) {
        return require('./mongo-db-instance').init(config);
    } else {
        config.loggers.error("Database configuration for mongodb not set");
    }
};