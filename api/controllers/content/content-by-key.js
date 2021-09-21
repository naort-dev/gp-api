/**
 * content/all-content
 *
 * @description :: Returns all content from our CMS.
 * @help        :: See https://sailsjs.com/documentation/concepts/actions-and-controllers
 */

module.exports = {
  friendlyName: 'Landing page content Content',

  inputs: {
    key: {
      required: true,
      type: 'string',
    },
  },

  exits: {
    success: {
      description: 'ok',
      responseType: 'ok',
    },
    badRequest: {
      description: 'Error',
      responseType: 'badRequest',
    },
  },

  fn: async function(inputs, exits) {
    try {
      const { key } = inputs;
      let content = await sails.helpers.cacheHelper('get', 'content');
      if (!content) {
        const contents = await CmsContent.find();

        if (contents.length === 1) {
          content = { ...JSON.parse(contents[0].content) };
          await sails.helpers.cacheHelper('set', 'content', content);
        }
      }
      if (content[key]) {
        return exits.success({
          content: content[key],
        });
      } else {
        return exits.badRequest({
          message: 'No Content Found',
        });
      }
    } catch (err) {
      console.log(err);
      await sails.helpers.errorLoggerHelper(
        'Error at content/landing-page-content',
        err,
      );
      return exits.badRequest({
        message: 'Content fetch failed.',
      });
    }
  },
};