const multer = require('multer'),
    path = require('path'),
    config = require('../../config').get(),
    fs = require('fs'),
    s3 = config.awsS3Client,
    { s3BucketName, s3ImagesLocal } = config.awsCredentials;


const imageFilter = (req, file, cb) => {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
        req.fileValidationError = 'Only image files are allowed!';
        return cb(new Error('Only image files are allowed! [jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF], [Image size should be less than 2mb]'), false);
    }
    cb(null, true);
};

var upload = multer({
    limits: {
        fileSize: 2097152  // 2MB
    },
    fileFilter: imageFilter,
    storage: multer.diskStorage({
        destination: function (req, file, callback) {
            callback(null, `./public/${s3ImagesLocal}`);
        },
        filename: function (req, file, callback) {
            callback(null, file.originalname);
        }
    })
});

function uploadS3Img(file, callback) {
    // Setting up S3 upload parameters
    let filepath = `./public/${s3ImagesLocal}/${file}`;
    let img = fs.createReadStream(filepath)
    var album = encodeURIComponent('coordinator-profile-image');
    const key = `${album}/${process.env.NODE_ENV}/${Date.now().toString()}${path.extname(file)}`

    const params = {
        Bucket: s3BucketName,
        Key: key,
        Body: img
    };
    // Uploading files to the bucket
    s3.upload(params, (err, data) => {
        if (err) {
            logger.error("Image upload failed", err)
            return callback(err, null)
        }
        logger.info("Image uploaded succesfully");
        return callback(null, data.Location)
    })
};

module.exports = { upload: upload, uploadS3Img: uploadS3Img };