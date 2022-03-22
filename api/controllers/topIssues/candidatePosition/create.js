module.exports = {
  inputs: {
    description: {
      type: 'string',
      required: true,
    },
    candidateId: {
      type: 'number',
      required: true,
    },
    positionId: {
      type: 'number',
      required: true,
    },
    topIssueId: {
      type: 'number',
      required: true,
    },
    order: {
      type: 'number',
      required: true,
    },
  },

  exits: {
    success: {
      description: 'Created',
    },

    badRequest: {
      description: 'Error creating',
      responseType: 'badRequest',
    },
    forbidden: {
      description: 'Unauthorized',
      responseType: 'forbidden',
    },
  },

  async fn(inputs, exits) {
    try {
      const { user } = this.req;
      const {
        description,
        candidateId,
        positionId,
        topIssueId,
        order,
      } = inputs;
      const candidate = await Candidate.findOne({ id: candidateId });
      const canAccess = await sails.helpers.staff.canAccess(candidate, user);
      if (!canAccess || canAccess === 'staff') {
        return exits.forbidden();
      }

      await CandidatePosition.create({
        description,
        candidate: candidateId,
        position: positionId,
        topIssue: topIssueId,
        order,
      });

      return exits.success({
        message: 'created',
      });
    } catch (e) {
      console.log('error at issue position/create', e);
      return exits.badRequest({
        message: 'Error creating issue position',
        e,
      });
    }
  },
};
