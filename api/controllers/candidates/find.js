/**
 * incumbents/find.js
 *
 * @description :: Find all Presidential Candidates.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
// const votesThreshold = require('../../../data/presidentialThreshold');
const timeago = require('time-ago');

module.exports = {
  friendlyName: 'Find by id one Presidential Candidates',

  description: 'Find by id one Presidential Candidates ',

  inputs: {
    id: {
      type: 'string',
      required: true,
    },
    chamber: {
      type: 'string',
      required: true,
    },
    isIncumbent: {
      type: 'boolean',
      required: true,
    },
  },

  exits: {
    success: {
      description: 'Presidential Candidate Found',
      responseType: 'ok',
    },
    notFound: {
      description: 'Presidential Candidate Not Found.',
      responseType: 'notFound',
    },
  },

  fn: async function(inputs, exits) {
    try {
      const { id, chamber, isIncumbent } = inputs;
      const candidate = await sails.helpers.findCandidate(
        id,
        chamber,
        !!isIncumbent,
      );

      return exits.success({
        ...candidate,
      });
    } catch (e) {
      await sails.helpers.errorLoggerHelper('Error at candidates/find', e);
      console.log('Error in find candidate', e);
      return exits.notFound();
    }
  },
};

const properCase = city => {
  return city
    .split(' ')
    .map(w => w[0].toUpperCase() + w.substr(1).toLowerCase())
    .join(' ');
};
