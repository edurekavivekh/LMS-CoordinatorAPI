const multer           = require('multer'),
      multerS3         = require('multer-s3'),
      path             = require('path'),
      s3               = require('./s3.config'),
      config           = require('../../config').get(),
      { s3BucketName } = config.awsCredentials;

const imageFilter = (req, file, cb) => {
    let checkextension = (/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/).test(file.originalname)

    // Accept images only
    if (!checkextension) {
        req.fileValidationError = `Method accespts only images [jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF]', ['Image size should be less than 2mb], ['The file uploaded is not an image']`;
        return cb(null, false);
    }
    cb(null, true);
}

var upload = multer({
    limits: {
        fileSize: 2097152  // 2MB
    },
    fileFilter: imageFilter,
    storage   : multerS3({
        s3    : s3,
        bucket: s3BucketName,
        key   : (req, file, callback) => {
            var   album = encodeURIComponent('coordinator-profile-image');
            const key   = `${album}/${process.env.NODE_ENV}/${Date.now().toString()}${path.extname(file.originalname)}`
            return callback(null, key);
        }
    })
});

const deleteImg = async (s3url, callback) => {
    var filename = s3url.replace(/^.*[\\\/]/, '');
    s3.deleteObject({
        Bucket: s3BucketName,
        Key   : `coordinator-profile-image/development/${filename}`
    }, function (err, data) {
        if (err) return callback(err, null)
        else return callback(null, data)
    })
}

module.exports = { upload: upload, deleteImg: deleteImg };