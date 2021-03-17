/**
* @module  mongo-db-instance
* @desc    Promisified (with Bluebird) connection handler for Mongoose connections.
*
* @requires {@link https://github.com/visionmedia/debug|debug}
* @requires {@link https://github.com/petkaantonov/bluebird|bluebird}
* @requires {@link http://mongoosejs.com/|mongoose}
*
*/

'use strict';

var DEBUG_CONNECTING = 'Connecting to db server %s...';
var DEBUG_ALREADY_CONNECTED = 'Already connected to db server %s.';
var DEBUG_ALREADY_CONNECTING = 'Already connecting to db server %s.';
var DEBUG_CONNECTED = 'Successfully connected to db server %s.';
var DEBUG_CONNECTION_ERROR = 'An error has occured while connecting to db server %s.';
var DEBUG_DISCONNECTING = 'Disconnecting from db server %s...';
var DEBUG_ALREADY_DISCONNECTED = 'Already disconnected from db server %s.';
var DEBUG_ALREADY_DISCONNECTING = 'Already disconnecting from db server %s.';
var DEBUG_DISCONNECTED = 'Successfully disconnected from db server %s.';
var DEBUG_DISCONNECTION_ERROR = 'An error has occured while disconnecting from db server %s.';


var { success, error } = require("consola"),
    blueBird = require('bluebird'),
    mongoose = require('mongoose'),
    debug = require('debug'),
    d = debug('mongo-db-instance');

mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

var isState = function (state) {
    return mongoose.connection.readyState === mongoose.Connection.STATES[state];
};


/**
* @constructor
*
* @param {string} uri     - Mongoose connection URI.
* @see http://mongoosejs.com/docs/connections.html
* @param {object} options - Mongoose connection options.
*
*/
function MongoDBAdapter(uri, options) {
    this.uri = uri;
    this.options = options;
}


/**
* @description Add connection listeners without adding more than one for each event.
* This is done to avoid:
*   'warning: possible EventEmitter memory leak detected. 11 listeners added'
* More info: https://github.com/joyent/node/issues/5108
*/
MongoDBAdapter.prototype.addConnectionListener = function (event, cb) {
    var listeners = mongoose.connection.on;
    if (!listeners || !listeners[event] || listeners[event].length === 0) {
        mongoose.connection.once(event, cb.bind(this));
    }
};


/**
* @description Returns a promise that gets resolved when successfully connected to MongoDB URI, or rejected otherwise.
* @returns {Promise} Returns promise
*/
MongoDBAdapter.prototype.connect = function () {
    return new blueBird(function (resolve, reject) {
        if (isState('connected')) {
            d(DEBUG_ALREADY_CONNECTED, this.uri);
            return resolve(this.uri);
        }


        this.addConnectionListener('error', function (err) {
            d(DEBUG_CONNECTION_ERROR, this.uri);
            return reject(err);
        });


        this.addConnectionListener('open', function () {
            d(DEBUG_CONNECTED, this.uri);
            return resolve(this.uri);
        });


        if (isState('connecting')) {
            d(DEBUG_ALREADY_CONNECTING, this.uri);
        } else {
            d(DEBUG_CONNECTING, this.uri);
            mongoose.connect(this.uri, this.options);
        }


    }.bind(this));
};


/**
* @description Returns a promise that gets resolved when successfully disconnected from MongoDB URI, or rejected otherwise.
* @return {Promise} Bluebird promise
*/
MongoDBAdapter.prototype.disconnect = function () {
    return new blueBird(function (resolve, reject) {
        if (isState('disconnected') || isState('uninitialized')) {
            d(DEBUG_ALREADY_DISCONNECTED, this.uri);
            return resolve(this.uri);
        }


        this.addConnectionListener('error', function (err) {
            d(DEBUG_DISCONNECTION_ERROR, this.uri);
            return reject(err);
        });


        this.addConnectionListener('disconnected', function () {
            d(DEBUG_DISCONNECTED, this.uri);
            return resolve(this.uri);
        });


        if (isState('disconnecting')) {
            d(DEBUG_ALREADY_DISCONNECTING, this.uri);
        } else {
            d(DEBUG_DISCONNECTING, this.uri);
            mongoose.disconnect();
        }


    }.bind(this));
};

function connectDB(config) {
    var db = new MongoDBAdapter(config.database.mongodb.dbURI, config.database.mongodb.options)

    // Create the database connection 
    db.connect()
        .then(() => success({ message: `Mongodb connection established`, badge: true }))
        .catch((err) => error({ message: `Mongodb connection failed`, badge: true }))
}

module.exports = {
    init: function(config) {
        return connectDB(config);
    }
}