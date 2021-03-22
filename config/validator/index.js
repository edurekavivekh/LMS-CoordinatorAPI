const { buildCheckFunction } = require('express-validator');
const checkBodyAndQuery = buildCheckFunction(['body', 'params']);

module.exports = {
    val_user: (optional) => [
        checkBodyAndQuery('name').rtrim().ltrim()
            .isString()
            .exists()
            .optional(optional ? true : false)
            .notEmpty().withMessage(`Name is a required field`)
            .matches(/^[a-zA-Z\. ]+$/)
            .withMessage(`Name should contain only alphabets`)
            .isLength({ min: 3 }).withMessage(`Name must at least 3 character`)
        ,
        checkBodyAndQuery('mobile').trim().escape()
            .isInt()
            .exists()
            .optional(optional ? true : false)
            .notEmpty().withMessage(`Mobile is a required field`)
            .isMobilePhone(["en-IN", "en-US"]).withMessage(`Must provide a valid mobile number`)
            .isLength({ min: 10, max: 10 })
            .withMessage('Mobile number length must be 10 digit')
        ,
        checkBodyAndQuery('emailId').trim().escape()
            .notEmpty().withMessage(`Email id is a required field`)
            .exists()
            .optional(optional ? true : false)
            .isEmail().withMessage('Invalid email')
    ],

    val_objectId: (reqField) => [
        checkBodyAndQuery(`${reqField}`).trim()
            .notEmpty().withMessage(`${reqField} is a required field`)
            .exists()
            .isMongoId().withMessage(`Enter valid ${reqField}`)
    ],
}