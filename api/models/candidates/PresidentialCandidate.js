/**
 * Incumbent.js
 *
 * @description :: presidential candidate entity.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝
    openSecretsId: {
      type: 'string',
      required: true,
      unique: true,
    },
    name: {
      type: 'string',
      required: true,
    },
    party: {
      type: 'string',
    },
    image: {
      type: 'string',
    },
    combinedRaised: {
      type: 'number',
    },
    smallContributions: {
      type: 'number',
    },
    campaignReportDate: {
      type: 'string',
    },
    outsideReportDate: {
      type: 'string',
    },
    info: {
      type: 'string',
    },
    isIncumbent: {
      type: 'boolean',
    },
    isActive: {
      type: 'boolean',
    },
  },
  customToJSON: function() {
    // Return a shallow copy of this record with the password removed.
    return _.omit(this, ['createdAt', 'updatedAt']);
  },
};
