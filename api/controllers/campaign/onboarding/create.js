/**
 * user/register.js
 *
 * @description :: Stand Alone action2 for signing up a user.
 * @help        :: See https://sailsjs.com/documentation/concepts/actions-and-controllers
 */

const slugify = require('slugify');

module.exports = {
  inputs: {},

  exits: {
    success: {
      description: 'Campaign Created',
      responseType: 'ok',
    },
    badRequest: {
      description: 'creation failed',
      responseType: 'badRequest',
    },
  },
  fn: async function (inputs, exits) {
    try {
      const { user } = this.req;
      await sails.helpers.queue.consumer();

      const slug = await findSlug(user.name);
      const data = { slug };

      // see if the user already have campaign
      const existing = await Campaign.findOne({ user: user.id });
      if (existing) {
        return exits.success({
          slug: existing.slug,
        });
      }

      await Campaign.create({
        slug,
        data,
        isActive: false,
        user: user.id,
      });

      return exits.success({
        slug,
      });
    } catch (e) {
      console.log(e);
      return exits.badRequest({ message: 'Error creating campaign.' });
    }
  },
};

async function findSlug(name) {
  const slug = slugify(`${name}`, { lower: true });
  const exists = await Campaign.findOne({ slug });
  if (!exists) {
    return slug;
  }
  for (let i = 1; i < 100; i++) {
    let slug = slugify(`${name}${i}`, { lower: true });
    let exists = await Campaign.findOne({ slug });
    if (!exists) {
      return slug;
    }
  }
  return slug; // should not happen
}
