var mongoose = require('mongoose'),
    Schema   = mongoose.Schema,
    message  = 'Something bad happaned';

var coordinatorSchema = new Schema({
    name: {
        type    : String,
        trim    : true,
        required: true
    },
    mobile: {
        type     : Number,
        trim     : true,
        unique   : true,
        minlength: 10,
        maxlength: 10,
        required : true
    },
    emailId: {
        type    : String,
        trim    : true,
        required: true
    },
    profileImg: {
        type   : String,
        trim   : true,
        default: null
    },
    createdBy: {
        type    : Number,
        trim    : true,
        required: true
    },
}, {
    timestamps: true
})

var Coordinator = mongoose.model('coordinators', coordinatorSchema);

module.exports = {
    create(coordinatorData, callback) {
        try {
            var coordinator = new Coordinator({
                name      : coordinatorData.name,
                mobile    : coordinatorData.mobile,
                emailId   : coordinatorData.emailId,
                profileImg: coordinatorData.profileImg,
                createdBy : coordinatorData.createdBy
            })

            return coordinator.save()
                .then(result => callback(null, result))
                .catch(err => {
                    logger.error("error occur in create model while doc insert")
                    return callback(err, null)
                })
        } catch (err) {
            logger.error("error occur in create model catch block")
            return callback(message, null)
        }
    },

    find(coordinatorData, callback) {
        try {
            Coordinator.find(coordinatorData, (err, data) => {
                if (err) {
                    logger.error("error occur in find query model callback")
                    return callback(err, null)
                }
                return callback(data)
            })
        } catch (err) {
            logger.error("error occur in find query model catch block")
            return callback(message, null)
        }
    }
}