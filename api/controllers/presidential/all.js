/**
 * incumbents/all.js
 *
 * @description :: Find all Presidential Candidates.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const votesThreshold = require('../../../data/presidentialThreshold');

module.exports = {
  friendlyName: 'Find all Presidential Candidates',

  description: 'Find all Presidential Candidates ',

  inputs: {
    userState: {
      type: 'string',
      required: false,
      example: 'ca',
    },
  },

  exits: {
    success: {
      description: 'Presidential Candidates Found',
      responseType: 'ok',
    },
    notFound: {
      description: 'Presidential Candidates Not Found.',
      responseType: 'notFound',
    },
  },

  fn: async function(inputs, exits) {
    try {
      const { userState } = inputs;
      const candidates = await PresidentialCandidate.find({
        isActive: true,
      }).sort([{ isIncumbent: 'DESC' }, { combinedRaised: 'DESC' }]);
      const good = [];
      const notGood = [];
      const unknown = [];
      const presidentialThreshold = 50000000;

      let topRank = 0;
      for (let i = 0; i < candidates.length; i++) {
        const candidate = candidates[i];
        const { isGood } = await sails.helpers.goodnessHelper(
          candidate,
          'presidential',
          presidentialThreshold,
        );
        if (isGood === true) {
          const ranking = await Ranking.count({
            candidate: candidate.id,
          });
          if (ranking > topRank) {
            topRank = ranking;
          }
          good.push({
            ...candidate,
            isGood,
            ranking,
          });
        } else if (isGood === false) {
          notGood.push({
            ...candidate,
            isGood,
          });
        } else {
          const ranking = await Ranking.count({
            candidate: candidate.id,
          });
          if (ranking > topRank) {
            topRank = ranking;
          }
          unknown.push({
            ...candidate,
            isGood,
            ranking,
          });
        }
      }
      let votesNeeded = 38658139;
      if (userState) {
        votesNeeded = votesThreshold[userState];
      }

      return exits.success({
        presidential: {
          good,
          notGood,
          unknown,
          topRank,
          votesNeeded,
        },
      });
    } catch (e) {
      console.log('Error in finding presidential candidates', e);
      return exits.notFound();
    }
  },
};
