/**
 * @file index.js
 *
 * @description Index Configuration setup is required to run your server.
 *
 * @author  Dilip <aniket.chahare@bridgelabz.com>
 * @license ICS
 * @version 1.0
 */
;
var
    fs = require("fs"),
    path = require("path"),
    fse = require("fs-extra"),
    clc = require('cli-color'),
    winston = require("winston"),
    dateFormat = require('dateformat'),
    expressWinston = require("express-winston"),
    config,
    configTanent,
    _app;

var PROJECT_ROOT = path.join(__dirname, '..');
var _app = null;

/**
 * @description winston logging config
 */
var winstonConfig = {
    config: {
        levels: {
            error: 0,
            warn: 1,
            info: 2,
            debug: 3,
            trace: 4,
            data: 5,
            verbose: 6,
            silly: 7
        },
        colors: {
            error: 'red',
            warn: 'yellow',
            info: 'green',
            debug: 'cyan',
            trace: 'grey',
            data: 'magenta',
            verbose: 'cyan',
            silly: 'magenta'
        }
    },
    logDir: path.join(process.env.PROJECT_WINSTON_LOG_DIR, process.env.PROJECT_WINSTON_LOG_FOLDER)
};

/**
 * @description Creates the logging directory for the system, if it doesnt exists.
 */
if (!fs.existsSync(winstonConfig.logDir)) { // Create the directory if it does not exist
    fs.mkdirSync(winstonConfig.logDir, function (err, data) {
        if (err) {
            console.log("Error while creating logger system directory : ", JSON.stringify(err));
        }
    });
} else {
    fse.emptyDir(winstonConfig.logDir, function (err, done) {
        if (err) {
            console.log("", err);
        }
        if (done) {
            console.log('log dir: ', done);
        }
    });
}

/**
 * @description Defines the color for console
 */
var consoleColorMap = {
    "log": clc.blue,
    "warn": clc.yellow,
    "error": clc.red.bold,
    "info": clc.cyan
};

/**
 * Apply the console color to the actual consoles
 * @description Adds the timestamp & colors to the console function
 */
["log", "warn", "error", "info"].forEach(function (method) {
    var oldMethod = console[method].bind(console);
    console[method] = function () {
        var res = [];
        for (var x in arguments) {
            if (arguments.hasOwnProperty(x))
                res.push(arguments[x]);
        }
        oldMethod.apply(
            console, [consoleColorMap[method](dateFormat(new Date(), "ddd, mmm d yyyy h:MM:ss TT Z")), consoleColorMap[method](method), ':']
                .concat(consoleColorMap[method](res.join(" ")))
        );
    };
});

/**
 * @description Combine all the require config files.
 */
var envConfig = {
    "production": function () {
        return require('../config/production')(winstonConfig);
    },
    "development": function () {
        return require('../config/development')(winstonConfig);
    },
    "staging": function () {
        return require('../config/staging')(winstonConfig);
    }
}

/**
 * @description It return true if the current system is production
 * @param {*} config
 */
var isProduction = function (config) {
    return config.name == 'production';
};

/**
 * @description It return true if the current system is production
 * @param {*} config
 */
var isStage = function (config) {
    return config.name == 'staging';
};
/**
 * @description It return true if the current system is production
 * @param {*} config
 */

var isDevelopement = function (config) {
    return config.name == 'development';
};

/**
 * @description Attach the wiston logger to log the error through express access logs
 *
 * @param {any} config Consists of the environment details of the server.
 */
function _attachExpressLogger(config) {
    var logLevels = winstonConfig.config.levels;
    if (!config.isProduction) {
        logLevels.console = 'info,silly,warning,debug';
    }
    config.app.use(
        expressWinston.logger({
            transports: [
                new winston.transports.File({
                    'level': logLevels.file,
                    'prettyPrint': true,
                    'filename': path.join(process.env.PROJECT_EXPRESS_LOG_DIR, process.env.PROJECT_EXPRESS_LOG_FILE),
                    'timestamp': true
                })
            ]
        })
    );
};

/**
 * @description Attach the wiston logger to log the error through express
 *
 * @param {any} config config Consists of the environment details of the server.
 */
function _attachExpressErrorLogger(config) {
    var server = _app;
    var logLevels = winstonConfig.config.levels;
    if (!config.isProduction) {
        logLevels.console = "info,silly,warning,debug";
    }
    config.app.use(
        expressWinston.errorLogger({
            transports: [
                new winston.transports.Console({
                    'colorize': true,
                    'prettyPrint': true,
                    'label': 'express.error',
                    'eol': '\n',
                    'level': logLevels.console
                }),
                new winston.transports.File({
                    'level': logLevels.file,
                    'eol': '\n',
                    'prettyPrint': true,
                    'filename': process.env.PROJECT_EXPRESS_LOG_PATH,
                    'timestamp': true
                })
            ]
        })
    );
}


/**
 * @description Attempts to add file and line number info to the given log arguments.
 */
function formatLogArguments(args) {
    args = Array.prototype.slice.call(args);
    var stackInfo = getStackInfo(1);
    if (stackInfo) {
        // get file path relative to project root
        var calleeStr = '(' + stackInfo.relativePath + ':' + stackInfo.line + ')';
        if (typeof (args[0]) === 'string') {
            args[0] = calleeStr + ' ' + args[0];
        } else {
            args.unshift(calleeStr);
        }
    }
    return args;
}

/**
 * @description Parses and returns info about the call stack at the given index.
 */
function getStackInfo(stackIndex) {
    var stacklist = (new Error()).stack.split('\n').slice(3); var stackReg = /at\s+(.*)\s+\((.*):(\d*):(\d*)\)/gi;
    var stackReg2 = /at\s+()(.*):(\d*):(\d*)/gi;
    var s = stacklist[stackIndex] || stacklist[0];
    var sp = stackReg.exec(s) || stackReg2.exec(s);
    if (sp && sp.length === 5) {
        return {
            method: sp[1],
            relativePath: path.relative(PROJECT_ROOT, sp[2]),
            line: sp[3],
            pos: sp[4],
            file: path.basename(sp[2]),
            stack: stacklist.join('\n')
        };
    }
};

/**
 * @description Set the tanents list.
 * @param {Object} obj
 */
var setConfig = function (obj) {
    config = obj;
};

/**
 * @description Return the tanent list.
 * @return {configTanent} Returns the tanent object
 */
var getConfig = function () {
    return config;
};

/**
 * @exports : Exports the Config Environment based Configuration
 */
module.exports = {

	/**
	 * @description Setting the site configuration. Loading of the server starts here.
	 * @function {function} attach will wrap all configuration environment specific data,
	 * Domain URL, Redis, Mailer, AWS & logger
	 * @param {string} env Environment will state the environment to laod e.g. for production server it will be `production`
	 */
    set: function attach(
		/**
		 * @description env argument for initializing the environment specific configuration
		 * @var {string} env : Environment varibale name
		 */
        env,

		/**
		 * @description loading the Environment configuration.
		 * @var {string} _app Express application instance
		 */
        _app) {
        if (config == null) {

			/**
			 * @description loading the Environment configuration if env varialble is set otherwise load the local configuration.
			 */
            this.config = typeof envConfig[env] !== 'undefined' ? envConfig[env]() : envConfig.development();

			/**
			 * @description Express application instance.
			 */
            this.config.app = _app;

			/**
			 * @description Verify & check if its production server.
			 * isProduction(this.config) passing the loadded configuration to the function to get if it's production or not.
			 * @var {Object} this.config.isProduction is set to Boolean `true`
			 */
            this.config.isProduction = isProduction(this.config);

			/**
			 * @description Verify & check if it's stage server.
			 * isStage(this.config) passing the loadded configuration to the function to get if it's stage or not.
			 * @var {Object} this.config.isStage is set to Boolean `true`
			 */
            this.config.isStage = isStage(this.config);

			/**
			 * @description Verify & check if it's stage server.
			 * isStage(this.config) passing the loadded configuration to the function to get if it's stage or not.
			 * @var {Object} this.config.isStage is set to Boolean `true`
			 */
            this.config.isDevelopement = isDevelopement(this.config);

			/**
			 * @description Private function to load express Error logger.
			 * @param {Object} this.config Object key to pass
			 */
            _attachExpressErrorLogger(this.config);

			/**
			 * @description Private function to load the express logger.
			 * @param {Object} this.config Object key to pass
			 */
            _attachExpressLogger(this.config);

			/**
			 * @description Environment name `ename`, Setting the ename will know which environment is loaded.
			 */
            this.ename = (this.config.name) ? this.config.name : '';

            this.config.tanents = {};

            var that = this.config;//.loggers;

            this.config.logger = {
                log: function () {
                    that.loggers.info.apply(that, formatLogArguments(arguments));
                },
                info: function () {
                    that.loggers.info.apply(that, formatLogArguments(arguments));
                },
                warn: function () {
                    that.loggers.warn.apply(that, formatLogArguments(arguments));
                },
                debug: function () {
                    that.loggers.debug.apply(that, formatLogArguments(arguments));
                },
                error: function () {
                    that.loggers.error.apply(that, formatLogArguments(arguments));
                },
                trace: function () {
                    that.loggers.trace.apply(that, formatLogArguments(arguments));
                },
                data: function () {
                    that.loggers.data.apply(that, formatLogArguments(arguments));
                },
                silly: function () {
                    that.loggers.silly.apply(that, formatLogArguments(arguments));
                }
            };

            var thatLogger = this.config.logger;

			/**
			 * @description Notify user regarding current setup e.g. local, development or production
			 */
            // this.config.logger.info("Environment Set to:", this.ename);

			/**
			 * @description Require the database instance.
			 * @param {Object} this.config Pass the current config setup
			 */
            this.config.db = require("./database/")(this.config);

			/**
			 * @description Require the database instance.
			 * @param {Object} this.config Pass the current config setup
			 */
            this.config.validator = require("./validator/");

            config = this.config;

        }
        setConfig(config);
        return config;
    },
    get: function () {
        return getConfig();// return (isEmpty(config.tanents)) ?  getTanents(): config;
    },
    config: config
};