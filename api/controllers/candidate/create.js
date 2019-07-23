/**
 * candidate/create.js
 *
 * @description :: Create candidate and attach to user from token.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
module.exports = {
  friendlyName: 'Check user',

  description: 'Return user from jwt',

  inputs: {
    summary: {
      description: 'Summary of Candidate agenda',
      type: 'string',
    },
  },

  exits: {
    success: {
      description: 'Candidate Created',
      responseType: 'ok',
    },
    forbidden: {
      description: 'Can not create candidate',
      responseType: 'forbidden',
    },
  },

  fn: async function(inputs, exits) {
    const user = this.req.user;
    try {
      const candidate = await Candidate.create({
        summary: inputs.summary,
        user: user.id,
      }).fetch();
      candidate.populate(
        'user',
      );
      // candidate.user = user;
      return exits.success({
        candidate,
      });
    } catch (e) {
      console.log(e);
      return exits.forbidden(e);
    }
  },
};