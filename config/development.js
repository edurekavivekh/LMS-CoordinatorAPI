// module.exports = {
//     "isProduction": false,
//     "PORT": process.env.PORT,
//     "mongo": {
//         "url": process.env.MONGODB_URI,
//         "options": {
//             "useNewUrlParser": true,
//             "useUnifiedTopology": true
//         },
//         "createIndex": {
//             "useCreateIndex": true
//         }
//     },
// }

var winston = require('winston'),
    dateFormat = require('dateformat'),
    path = require('path');

/**
 * @exports : Exports developement Config Environment based Configuration
 */
module.exports = function (config) {
    var logDir = config.logDir;
    return {
        'name': process.env.NODE_ENV,
        'port': process.env.PORT || 3000,
        'database': {
            'debug': true,
            'mongodb': {
                'name': process.env.MONGODB_NAME,
                'dbURI': process.env.MONGODB_URI,
                "options": {
                    "useNewUrlParser": true,
                    "useUnifiedTopology": true
                },
                "createIndex": {
                    "useCreateIndex": true
                }
            }
        },
        'loggers': winston.createLogger({
            'exceptionHandlers': [
                new(winston.transports.Console)({
                    'json': true
                }),
                new(winston.transports.File)({
                    'level': 'error,warn',
                    'filename': path.join(logDir, process.env.PROJECT_WINSTON_LOG_EXCEPTION_FILE),
                    'handleExceptions': true,
                    'json': true,
                    'prettyPrint': true,
                    'zippedArchive': true,
                    'colorize': 'all',
                    'eol': '\n',
                    'timestamp': function () {
                        return '' + dateFormat(new Date(), 'ddd mmm d yyyy HH:MM:ss TT') + '';
                    },
                    'formatter': function (options) {
                        // Return string will be passed to logger.
                        var message = options.timestamp() + ' [' + options.level.toUpperCase() + '] - ' + (undefined !== options.message ? options.message : '') +
                            (options.meta && Object.keys(options.meta).length ? '\n\t' + JSON.stringify(options.meta) : '');
                        return winston.config.colorize(options.level, message);
                    }
                })
            ],
            'transports': [
                new winston.transports.File({
                    'level': 'info,error,warn',
                    'filename': path.join(logDir, process.env.PROJECT_WINSTON_ERROR_LOG_FILE),
                    'handleExceptions': true,
                    'json': true,
                    'prettyPrint': true,
                    'zippedArchive': true,
                    'colorize': 'all',
                    'eol': '\n',
                    'timestamp': function () {
                        return '' + dateFormat(new Date(), 'ddd mmm d yyyy HH:MM:ss TT') + '';
                    },
                    'formatter': function (options) {
                        // Return string will be passed to logger.
                        var message = options.timestamp() + ' [' + options.level.toUpperCase() + '] - ' + (undefined !== options.message ? options.message : '') +
                            (options.meta && Object.keys(options.meta).length ? '\n\t' + JSON.stringify(options.meta) : '');
                        return winston.config.colorize(options.level, message);
                    }
                }),
                new winston.transports.Console({
                    'level': 'info',
                    'handleExceptions': true,
                    'json': false,
                    'colorize': 'all',
                    'eol': '\n',
                    'timestamp': function () {
                        return '' + dateFormat(new Date(), 'ddd mmm d yyyy HH:MM:ss TT') + '';
                    },
                    'formatter': function (options) {
                        // Return string will be passed to logger.
                        var message = options.timestamp() + ' [' + options.level.toUpperCase() + '] - ' + (undefined !== options.message ? options.message : '') +
                            (options.meta && Object.keys(options.meta).length ? '\n\t' + JSON.stringify(options.meta) : '');
                        return winston.config.colorize(options.level, message);
                    }
                })
            ],
            'exitOnError': false,
            'levels': config.levels,
            'colors': config.colors
        }),
        'stream': {
            write: function (message, encoding) {
                this.loggers.info(message);
            }
        }
    };
};