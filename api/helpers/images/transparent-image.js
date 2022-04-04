const removeBackgroundFromImageUrl = require('remove.bg')
  .removeBackgroundFromImageUrl;
const removeBgKey = sails.config.custom.removeBgKey || sails.config.removeBgKey;
const fs = require('fs');
const path = require('path');
const s3Key = sails.config.custom.s3Key || sails.config.s3Key;
const s3Secret = sails.config.custom.s3Secret || sails.config.s3Secret;
const AWS = require('aws-sdk');
const assetsBase = sails.config.custom.assetsBase || sails.config.assetsBase;

module.exports = {
  friendlyName: 'Cache helper',

  description:
    'in memoery caching using cacheman: https://github.com/cayasso/cacheman',

  inputs: {
    url: {
      type: 'string',
      required: true,
    },
    candidateName: {
      type: 'string',
      required: true,
    },
  },

  exits: {
    success: {
      description: 'Cache operation done',
    },
    badRequest: {
      description: 'Error caching',
    },
  },

  fn: async function(inputs, exits) {
    try {
      const { url, candidateName } = inputs;

      const outputFile = path.join(
        __dirname,
        `../../../tempImages/img-removed-from-file.png`,
      );
      await removeBackgroundFromImageUrl({
        url,
        apiKey: removeBgKey,
        size: 'regular',
        type: 'person',
        crop: true,
        outputFile,
      });

      console.log(`File saved to ${outputFile}`);

      // await sails.helpers.images.optimizeImage(outputFile);

      const bucketName = `${assetsBase}/candidate-info`;

      const content = fs.readFileSync(outputFile);
      const uuid = Math.random()
        .toString(36)
        .substring(2, 8);
      const fileName = `${candidateName}-${uuid}.png`;

      let params = {
        Bucket: bucketName,
        Key: fileName,
        Body: content,
        ContentType: 'image/png',
        ACL: 'public-read',
        CacheControl: 'max-age=31536000',
      };

      const s3 = new AWS.S3({
        accessKeyId: s3Key,
        secretAccessKey: s3Secret,
      });

      await s3.putObject(params).promise();

      const s3Url = `https://${bucketName}/${fileName}`;
      return exits.success(s3Url);
    } catch (e) {
      console.log('error at transparent image helper', e);
      return exits.success(inputs.url);
    }
  },
};
