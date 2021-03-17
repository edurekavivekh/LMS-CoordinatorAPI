var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    message = 'Something bad happaned';

var coordinatorSchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    mobile: {
        type: Number,
        trim: true,
        unique: true,
        minlength: 10,
        maxlength: 10,
        required: true
    },
    emailId: {
        type: String,
        trim: true,
        required: true
    },
    profileImg: {
        type: String,
        trim: true,
        default: null
    },
    createdBy: {
        type: String,
        trim: true,
        required: true
    },
}, {
    timestamps: true
})

var Coordinator = mongoose.model('coordinators', coordinatorSchema);
