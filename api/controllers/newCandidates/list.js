/**
 * incumbents/find.js
 *
 * @description :: Find all Presidential Candidates.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const axios = require('axios');
const appBase = sails.config.custom.appBase || sails.config.appBase;

module.exports = {
  friendlyName: 'All Candidates',

  description: 'All Candidates',

  inputs: {
    position: {
      type: 'string',
    },
    state: {
      type: 'string',
    },
  },

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

  fn: async function (inputs, exits) {
    try {
      const { position, state } = inputs;
      const criteria = { isActive: true };
      if (state) {
        criteria.state = state;
      }
      let positionId = false;
      if (position && position !== 'all') {
        positionId = parseInt(position.split('|')[1], 10);
      }
      const positionCriteria = {};
      if (positionId) {
        positionCriteria.id = positionId;
      }

      const candidates = await Candidate.find(criteria).populate('positions');

      const activeCandidates = [];
      const possibleStates = {};
      const currentYear = new Date().getFullYear();
      const janFirst = new Date(`01-01-${currentYear}`);
      for (let i = 0; i < candidates.length; i++) {
        const candidate = candidates[i];
        if (positionId) {
          let hasPosition = false;
          // filter candidates who don't match the position id
          for (let j = 0; j < candidate.positions.length; j++) {
            if (candidate.positions[j].id === positionId) {
              hasPosition = true;
              break;
            }
          }
          if (!hasPosition) {
            continue; // skip this candidate
          }
        }
        const data = candidate.data ? JSON.parse(candidate.data) : {};
        const { electionDate } = data;

        // skip candidates with a race date before this calendar year.
        if (electionDate) {
          const electionDateObj = new Date(electionDate);
          if (electionDateObj < janFirst) {
            continue;
          }
        } else {
          continue; // old candidates
        }

        const {
          slug,
          firstName,
          lastName,
          id,
          image,
          party,
          otherParty,
          race,
          state,
          zip,
          color,
          isClaimed,
          whyRunning,
          whyIndependent,
          experience,
          hometown,
          occupation,
          funFact,
          office,
          district,
          counties,
          didWin,
          term,
          likelyVoters,
          votesReceived,
          votesNeeded,
        } = data;

        activeCandidates.push({
          slug,
          firstName,
          lastName,
          id,
          image,
          party,
          otherParty,
          race,
          state,
          zip,
          color,
          positions: candidate.positions,
          isClaimed,
          whyRunning,
          whyIndependent,
          experience,
          hometown,
          occupation,
          funFact,
          office,
          district,
          counties,
          didWin,
          term,
          likelyVoters,
          votesReceived,
          votesNeeded,
          electionDate,
        });
        if (candidate.state && candidate.state !== '') {
          possibleStates[candidate.state] = candidate.state;
        }
      }

      const positions = await Position.find()
        .populate('candidates')
        .populate('topIssue')
        .sort([{ name: 'ASC' }]);

      const candidatesHash = {};
      activeCandidates.forEach((candidate) => {
        candidatesHash[candidate.id] = true;
      });
      const filteredPositions = [];
      positions.forEach((position) => {
        if (position.candidates.length > 0) {
          for (let i = 0; i < position.candidates.length; i++) {
            const candidateId = position.candidates[i].id;
            if (candidatesHash[candidateId]) {
              filteredPositions.push(position);
              break;
            }
          }
        }
      });

      filteredPositions.sort((a, b) => {
        return b.candidates.length - a.candidates.length;
      });

      const states = Object.values(possibleStates);
      states.sort();

      const finalResponse = {
        candidates: activeCandidates,
        positions: filteredPositions || [],
        states,
      };
      return exits.success(finalResponse);
    } catch (e) {
      console.log('Error in find candidate', e);
      return exits.badRequest({ message: 'error finding candidates' });
    }
  },
};
