const request = require('request-promise');

module.exports = {
  friendlyName: 'S3 Uploader',

  description: 'Get a file from scrape bucket',

  inputs: {
    fileName: {
      friendlyName: 'filename in s3 bucket',
      type: 'string',
    },
  },

  fn: async function(inputs, exits) {
    try {
      const { fileName } = inputs;
      const [content, err] = await request(
        `https://s3-us-west-2.amazonaws.com/scrape.thegoodparty.org/${fileName}`,
      );
      return exits.success({
        content,
      });
    } catch (e) {
      console.log('error getting file from s3', e);
      return exits.badRequest({
        message: 'error getting file from s3',
      });
    }
  },
};
