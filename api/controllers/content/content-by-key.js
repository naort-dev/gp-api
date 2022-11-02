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
    subKey: {
      type: 'string',
    },
    subValue: {
      type: 'string',
    },
    limit: {
      type: 'number',
    },
    deleteKey: {
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
      const { key, subKey, subValue, limit, deleteKey } = inputs;
      let content = await sails.helpers.cacheHelper('get', 'content');
      if (!content) {
        const contents = await CmsContent.find();

        if (contents.length === 1) {
          content = { ...JSON.parse(contents[0].content) };
          await sails.helpers.cacheHelper('set', 'content', content);
        }
      }
      const keyContent = content[key];
      if (keyContent) {
        if (subKey) {
          for (let i = 0; i < keyContent.length; i++) {
            if (keyContent[i][subKey] === subValue) {
              return exits.success({ content: keyContent[i] });
            }
          }
        } else {
          let contentWithLimit;
          if (limit && Array.isArray(keyContent) && limit < keyContent.length) {
            contentWithLimit = keyContent.splice(limit);
          } else {
            contentWithLimit = keyContent;
          }
          if (deleteKey) {
            contentWithLimit.forEach(item => {
              delete item[deleteKey];
            });
          }
          return exits.success({
            content: contentWithLimit,
          });
        }
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
