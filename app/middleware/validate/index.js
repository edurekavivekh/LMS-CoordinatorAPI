const { validationResult } = require('express-validator');

exports.validate = (req, res, next) => {

    var response = {
        'success': false,
        'message': 'Something went wrong',
        'data': {}
    };

    try {

        var errors = validationResult(req);
        if (!errors.isEmpty()) {
            response.error = errors.array();
            return res.status(422).send(response);
        } else {
            next();
        }

    } catch (err) {
        if (err instanceof TypeError
            || err instanceof SyntaxError
            || err instanceof EvalError
            || err instanceof RangeError
            || err instanceof ReferenceError) {
            // logger.error('Programming Error: ', (err));
            console.log('Programming Error: ', (err));
        } else {
            // logger.warn('User defined Errors: ', err);
            console.log('User defined Errors: ', err);
        }
        console.log('err', err);
        return res.status(500).json(response);
    }
}