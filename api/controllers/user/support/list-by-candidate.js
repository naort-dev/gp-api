module.exports = {
  friendlyName: 'User supports',

  inputs: {
    candidateId: {
      description: 'candidate id',
      example: 1,
      required: true,
      type: 'number',
    },
  },

  exits: {
    success: {
      description: 'Supports found',
    },

    badRequest: {
      description: 'Error finding support',
      responseType: 'badRequest',
    },
  },

  fn: async function(inputs, exits) {
    try {
      const { candidateId } = inputs;
      const candidateSupports = await Support.find({
        candidate: candidateId,
      })
        .sort([{ createdAt: 'DESC' }])
        .populate('user');

      const supportWithLimit = [];
      const MAX = 20;
      const supportLength = Math.min(MAX, candidateSupports.length);
      for (let i = 0; i < supportLength; i++) {
        const support = candidateSupports[i];
        support.timeAgo = await sails.helpers.timeAgo(support.createdAt);
        support.message = null;
        support.type = 'endorse';
        if (support.user && support.user.name) {
          support.user = await sails.helpers.fullFirstLastInitials(
            support.user.name,
          );
        } else {
          support.user = '';
        }
        supportWithLimit.push(support);
      }

      const candidateShares = await ShareCandidate.find({
        candidate: candidateId,
      })
        .sort([{ createdAt: 'DESC' }])
        .populate('user');

      const shareWithLimit = [];

      const shareLength = Math.min(MAX, candidateShares.length);
      for (let i = 0; i < shareLength; i++) {
        const share = candidateShares[i];
        share.timeAgo = await sails.helpers.timeAgo(share.createdAt);
        share.type = 'share';
        if (share.user && share.user.name) {
          share.user = await sails.helpers.fullFirstLastInitials(
            share.user.name,
          );
        } else {
          share.user = '';
        }
        shareWithLimit.push(share);
      }
      const combined = supportWithLimit.concat(shareWithLimit);
      combined.sort((a, b) => b.createdAt - a.createdAt);

      return exits.success({
        candidateSupports: combined,
        total: candidateSupports.length,
      });
    } catch (e) {
      console.log(e);
      return exits.badRequest({
        message: 'Error finding supports',
      });
    }
  },
};
