/**
 * incumbents/find.js
 *
 * @description :: Find all Presidential Candidates.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  friendlyName: 'Homepage Candidate',

  description: 'Homepage Candidate ',

  inputs: {},

  exits: {
    success: {
      description: 'Candidates Found',
      responseType: 'ok',
    },
    badRequest: {
      description: 'Candidates Not Found.',
      responseType: 'notFound',
    },
  },

  fn: async function(inputs, exits) {
    try {
      const candidates = await Candidate.find({
        isActive: true,
        isOnHomepage: true,
      }).limit(3);

      const homepageCandidates = [];
      for (let i = 0; i < candidates.length; i++) {
        const candidate = candidates[i];

        const data = JSON.parse(candidate.data);
        delete data.comparedCandidates;
        delete data.updates;
        delete data.updatesDates;
        const supporters = await Support.count({
          candidate: candidate.id,
        });
        data.supporters = supporters || 0;

        homepageCandidates.push(data);
      }

      return exits.success({
        homepageCandidates,
      });
    } catch (e) {
      console.log('Error in find candidate', e);
      return exits.notFound();
    }
  },
};