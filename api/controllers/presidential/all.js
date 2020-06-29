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
    state: {
      type: 'string',
      required: false,
      example: 'ca',
    },
    zip: {
      type: 'string',
      required: false,
      example: '90210',
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
      const { userState, state, zip } = inputs;
      const candidates = await PresidentialCandidate.find({
        isActive: true,
      }).sort([{ isIncumbent: 'DESC' }, { order: 'ASC' }]);
      const good = [];
      const notGood = [];
      const unknown = [];
      const presidentialThreshold = 50000000;

      let topRank = 0;
      for (let i = 0; i < candidates.length; i++) {
        const candidate = candidates[i];
        candidate.chamber = 'Presidential';
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
      let threshold = 38658139;
      let resolvedState;
      if (state) {
        resolvedState = state;
      } else if (zip) {
        const zipRecord = await ZipCode.findOne({ zip });
        if (zipRecord) {
          resolvedState = zipRecord.stateShort;
        }
      } else if (userState) {
        resolvedState = userState;
      }
      if (resolvedState) {
        threshold = votesThreshold[resolvedState];
      }

      let electors = 270;
      if (resolvedState) {
        ({ electors } = await sails.helpers.electorsByStateHelper(
          resolvedState,
        ));
      }

      return exits.success({
        presidential: {
          good,
          notGood,
          unknown,
          topRank,
          threshold,
          electors,
        },
      });
    } catch (e) {
      console.log('Error in finding presidential candidates', e);
      await sails.helpers.errorLoggerHelper('Error at presidential/all', e);
      return exits.notFound();
    }
  },
};
