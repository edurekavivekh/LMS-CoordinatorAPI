// module.exports = {
//     "isProduction": false,
//     "PORT": process.env.PORT,
//     "mongo": {
//         "url": process.env.MONGODB_URI,
//         "options": {
//             "useNewUrlParser": true
//         },
//         "createIndex": {
//             "useCreateIndex": true
//         }
//     },
// }

var winston    = require('winston'),
    dateFormat = require('dateformat'),
    path       = require('path'),
    util       = require('util');

/**
 * @exports: Exports developement Config Environment based Configuration
 */
module.exports = function (config) {
    var logDir = config.logDir;
    function transform(info, opts) {
        const args = info[Symbol.for('splat')];
        if (args) { info.message = util.format(info.message, ...args); }
        return info;
    }

    function utilFormatter() { return { transform }; }
    return {
        'name'    : process.env.NODE_ENV,
        'port'    : process.env.PORT || 3000,
        'database': {
            'debug'  : true,
            'mongodb': {
                'name'   : process.env.MONGODB_NAME,
                'dbURI'  : process.env.MONGODB_URI,
                "options": {
                    "useNewUrlParser"   : true,
                    "useUnifiedTopology": true
                },
                "createIndex": {
                    "useCreateIndex": true
                }
            }
        },
        'awsConfig': {
            's3BucketName'   : process.env.AWS_S3_BUCKET_NAME,
            's3ImagesLocal'  : process.env.AWS_S3_IMAGESLOCAL,
            'accessKeyId'    : process.env.AWS_S3_ACCESSKEY_ID,
            'secretAccessKey': process.env.AWS_S3_SECRET_ACCESSKEY,
            'region'         : process.env.AWS_S3_REGION
        },
        'loggers': winston.createLogger({
            'exceptionHandlers': [
                new (winston.transports.Console)({
                    'json': true
                }),
                new (winston.transports.File)({
                    'level'           : 'error,warn',
                    'filename'        : path.join(logDir, process.env.PROJECT_WINSTON_LOG_EXCEPTION_FILE),
                    'handleExceptions': true,
                    'json'            : true,
                    'prettyPrint'     : true,
                    'zippedArchive'   : true,
                    'colorize'        : 'all',
                    'eol'             : '\n',
                    'format'          : winston.format.combine(
                        winston.format.timestamp({ format: () => '' + dateFormat(new Date(), 'ddd mmm d yyyy HH:MM:ss TT') + '' }),
                        utilFormatter(),
                        winston.format.printf(({ level, message, timestamp, ...metadata }) => {
                            // Return string will be passed to logger.
                            return timestamp + ' [' + level.toUpperCase() + '] - ' + (undefined !== message ? message : '') +
                                (metadata && Object.keys(metadata).length ? '\n\t' + JSON.stringify(metadata) : '');
                        }),
                        winston.format.colorize({ all: true }),
                    ),
                })
            ],
            'transports': [
                new winston.transports.File({
                    'level'           : 'error',
                    'filename'        : path.join(logDir, process.env.PROJECT_WINSTON_ERROR_LOG_FILE),
                    'handleExceptions': true,
                    'json'            : true,
                    'prettyPrint'     : true,
                    'zippedArchive'   : true,
                    'colorize'        : 'all',
                    'eol'             : '\n',
                    'format'          : winston.format.combine(
                        winston.format.timestamp({ format: () => '' + dateFormat(new Date(), 'ddd mmm d yyyy HH:MM:ss TT') + '' }),
                        utilFormatter(),
                        winston.format.printf(({ level, message, timestamp, ...metadata }) => {
                            // Return string will be passed to logger.
                            return timestamp + ' [' + level.toUpperCase() + '] - ' + (undefined !== message ? message : '') +
                                (metadata && Object.keys(metadata).length ? '\n\t' + JSON.stringify(metadata) : '');
                        }),
                        winston.format.colorize({ all: true }),
                    ),
                }),
                new winston.transports.File({
                    'level'           : 'info',
                    'filename'        : path.join(logDir, process.env.PROJECT_WINSTON_LOG_FILE),
                    'handleExceptions': true,
                    'json'            : true,
                    'prettyPrint'     : true,
                    'zippedArchive'   : true,
                    'colorize'        : 'all',
                    'eol'             : '\n',
                    'format'          : winston.format.combine(
                        winston.format.timestamp({ format: () => '' + dateFormat(new Date(), 'ddd mmm d yyyy HH:MM:ss TT') + '' }),
                        utilFormatter(),
                        winston.format.printf(({ level, message, timestamp, ...metadata }) => {
                            // Return string will be passed to logger.
                            return timestamp + ' [' + level.toUpperCase() + '] - ' + (undefined !== message ? message : '') +
                                (metadata && Object.keys(metadata).length ? '\n\t' + JSON.stringify(metadata) : '');
                        }),
                        winston.format.colorize({ all: true }),
                    ),
                }),
                new winston.transports.Console({
                    'level'           : 'info',
                    'handleExceptions': true,
                    'json'            : false,
                    'colorize'        : 'all',
                    'eol'             : '\n',
                    'format'          : winston.format.combine(
                        winston.format.timestamp({ format: () => '' + dateFormat(new Date(), 'ddd mmm d yyyy HH:MM:ss TT') + '' }),
                        utilFormatter(),
                        winston.format.printf(({ level, message, timestamp, ...metadata }) => {
                            // Return string will be passed to logger.
                            return timestamp + ' [' + level.toUpperCase() + '] - ' + (undefined !== message ? message : '') +
                                (metadata && Object.keys(metadata).length ? '\n\t' + JSON.stringify(metadata) : '');
                        }),
                        winston.format.colorize({ all: true }),
                    ),
                })
            ],
            'exitOnError': false,
            'levels'     : config.levels,
            'colors'     : config.colors
        }),
        'stream': {
            write: function (message, encoding) {
                this.loggers.info(message);
            }
        }
    };
};