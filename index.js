require('dotenv').config();
// require('./config/database/mongo-db-instance');

const express     = require('express'),
      bodyParser  = require('body-parser'),
      morgan      = require('morgan'),
      cors        = require('cors'),
      { success } = require("consola");

const app        = express(),
      configInit = require("./config/").set(process.env.NODE_ENV, app),
      routes     = require('./app/routes'),
      config     = require("./config/").get();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('dev'));
app.disable('x-powered-by');
app.use(cors());

app.use('/', routes);

app.use('*/*', (req, res, next) => {
    res.status(404).send({
        success   : false,
        statuscode: 404,
        message   : "Page Not found"
    });
});

app.use((err, req, res, next) => {
    console.log(err);
    
    if (!err) return next();

    res.status(500).send({
        error: {
            success   : false,
            statuscode: 500,
            message   : 'Internal Server Error'
        }
    });
});

/**
 * @description Winston logger derived from the config
 */
global.logger = config.loggers;

// start server
app.listen(process.env.PORT, function () {
    success({ message: `Express server listening on ${process.env.PORT}, in ${app.get('env')} mode`, badge: true });
});