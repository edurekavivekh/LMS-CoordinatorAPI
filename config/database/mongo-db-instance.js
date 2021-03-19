/**
* @module  mongo-db-instance
* @desc    Event based connection handler for Mongoose connections.
*
* @requires {@link http://mongoosejs.com/|mongoose}
*
*/

'use strict';

var { success, error } = require("consola"),
    mongoose = require('mongoose'),
    config = require('../../config/').config;

mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);


function connectDB() {
    // Create the database connection
    mongoose.connect(config.database.mongodb.dbURI, config.database.mongodb.options, (err) => {
        if (err) {
            error({ message: `Mongodb connection failed`, badge: true })
            logger.error('MongoDB connection error: ' + err);
            process.exit(1);
        }
    })
    // .then(() => success({ message: `Mongodb connection established`, badge: true }))
    // .catch((err) => {
    //     error({ message: `Mongodb connection failed`, badge: true })
    //     logger.error('MongoDB connection error: ' + err);
    //     process.exit(1);
    // })

    mongoose.connection.on('connected', () => {
        logger.info('MongoDB event connected : ' + config.database.mongodb.dbURI);
        success({ message: `Mongodb connection established`, badge: true })
    });

    mongoose.connection.on('error', (err) => {
        logger.error('MongoDB event error: ' + JSON.stringify(err, 0, 4));
    });

    mongoose.connection.on('disconnected', () => {
        logger.info('MongoDB event disconnected');
        if (config.isProduction) {
            logger.warn('MongoDB event disconnected ');
        } else {
            logger.warn('MongoDB event disconnected : ' + config.database.mongodb.dbURI);
        }
    });

    mongoose.connection.on('reconnected', () => {
        logger.info('MongoDB event reconnected');
    });

    mongoose.connection.on('timeout', (err) => {
        logger.info('Mongoose timeout');
        logger.error('Mongoose timeout ' + JSON.stringify(err, 0, 4));
    });

    return mongoose;
}

var gracefulExit = () => {
    mongoose.connection.close(() => {
        if (config.isProduction) {
            logger.info('Mongoose default connection with DB :' + config.database.mongodb.dbURI + ' is disconnected through app termination');
        } else {
            logger.warn('MongoDB event disconnected : ' + config.database.mongodb.dbURI);
        }
        logger.info('Mongoose default connection with DB :' + config.database.mongodb.dbURI + ' is disconnected through app termination');
        process.exit(0);
    });
}
// If the Node process ends, close the Mongoose connection
process.on('SIGINT', gracefulExit); //.on('SIGTERM', gracefulExit);

module.exports = {
    init: () => {
        return connectDB();
    }
}