/**
 * user/register.js
 *
 * @description :: Stand Alone action2 for signing up a user.
 * @help        :: See https://sailsjs.com/documentation/concepts/actions-and-controllers
 */
const fs = require('fs');

module.exports = {
  friendlyName: 'Update Share Image',

  description: 'Admin endpoint to update share image with new one.',

  inputs: {
    candidate: {
      type: 'json',
      required: true,
    },
  },

  exits: {
    success: {
      description: 'Share Image updated',
      responseType: 'ok',
    },
    badRequest: {
      description: 'update Failed',
      responseType: 'badRequest',
    },
  },
  async fn(inputs, exits) {
    try {
      const fileExt = 'jpeg';
      const { candidate } = inputs;
      const { id, lastName, firstName, imageBase64 } = candidate;
      const name = `${firstName
        .toLowerCase()
        .replace(/ /g, '-')}-${lastName.toLowerCase().replace(/ /g, '-')}`;
      // upload the image

      if (imageBase64) {
        const assetsBase =
          sails.config.custom.assetsBase || sails.config.assetsBase;
        const cleanBase64 = imageBase64.replace(/^data:image\/.*;base64,/, '');
        const path = `share-images/${name}-${id}.${fileExt}`;
        fs.writeFile(path, cleanBase64, 'base64', async function (err) {
          console.log(err);
          fs.readFile(path, async (err, fileData) => {
            if (err) throw err;
            fs.unlink(path, (err) => {
              console.log("File is deleted.");
            });
            const fileName = `${name}-${id}.${fileExt}`;
            const data = {
              Key: fileName,
              Body: JSON.stringify(fileData),
              // ContentEncoding: 'base64',
              ContentType: `image/${fileExt}`,
            };

            await sails.helpers.s3Uploader(
              data,
              `${assetsBase}/share-image`,
              '',
              true,
            );
          });
        });
      }
      return exits.success({
        message: 'created',
      });
    } catch (e) {
      console.log(e);
      return exits.badRequest({ message: 'Error updating share image.' });
    }
  },
};