require('dotenv').config();

const express     = require('express'),
      bodyParser  = require('body-parser'),
      morgan      = require('morgan'),
      cors        = require('cors'),
      swagger_ui  = require('swagger-ui-express'),
      { success } = require("consola");

const app         = express(),
      configInit  = require("./config/").set(process.env.NODE_ENV, app),
      routes      = require('./app/routes'),
      swagger_doc = require('./app/lib/swagger-ui/api_docs'),
      config      = require("./config/").get();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.disable('x-powered-by');
app.use(express.static(__dirname + '/public'));
app.use('/', routes);
app.use('/coordinator/api_docs', swagger_ui.serve, swagger_ui.setup(swagger_doc));

app.get('/', (req, res) => {
    res.redirect('/coordinator/api_docs');
});

app.use('*/*', (req, res, next) => {
    res.status(404).send({
        success   : false,
        statuscode: 404,
        message   : "Page Not found"
    });
});

app.use((err, req, res, next) => {
    if (!err) return next();
    logger.error("Internal server error", err)
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