/**
 * incumbents/find.js
 *
 * @description :: Find all Presidential Candidates.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  friendlyName: 'Find Candidate associated with user',

  inputs: {
    id: {
      type: 'number',
      required: true,
    },
  },

  exits: {
    success: {
      description: 'Candidate Found',
      responseType: 'ok',
    },
    notFound: {
      description: 'Candidate Not Found.',
      responseType: 'notFound',
    },
    forbidden: {
      description: 'Unauthorized',
      responseType: 'forbidden',
    },
  },

  fn: async function(inputs, exits) {
    try {
      const { id } = inputs;
      const user = this.req.user;

      const candidate = await Candidate.findOne({
        id,
      }).populate('candidateUpdates');

      try {
        const canAccess = await sails.helpers.staff.canAccess(candidate, user);
        if (!canAccess) {
          return exits.forbidden();
        }
      } catch (e) {
        return exits.forbidden();
      }

      if (!candidate) {
        return exits.notFound();
      }

      let candidateData = JSON.parse(candidate.data);
      candidateData.updatesList = candidate.candidateUpdates;
      return exits.success({
        candidate: candidateData,
      });
    } catch (e) {
      console.log('Error in find candidate', e);
      return exits.notFound();
    }
  },
};