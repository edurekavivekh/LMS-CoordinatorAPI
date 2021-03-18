const AWS                                      = require('aws-sdk'),
      config                                   = require('../../config').get(),
      { accessKeyId, secretAccessKey, region } = config.awsCredentials;

const s3Client = new AWS.S3({
    accessKeyId    : accessKeyId,
    secretAccessKey: secretAccessKey,
    region         : region
});

module.exports = s3Client;