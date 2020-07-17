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
      allowNull: true,
    },
    isIncumbent: {
      type: 'boolean',
      allowNull: true,
    },
    isActive: {
      type: 'boolean',
      allowNull: true,
    },
    isApproved: {
      type: 'boolean',
      allowNull: true,
    },
    isAligned: {
      type: 'string',
      defaultsTo: 'unknown',
      isIn: ['unknown', 'yes', 'no'],
      allowNull: true,
    },
    isCertified: {
      type: 'boolean',
      allowNull: true,
    },
    source: {
      type: 'string',
      allowNull: true,
    },
    order: {
      type: 'number',
      allowNull: true,
      defaultsTo: 99,
    },
    blocName: {
      type: 'string',
      allowNull: true,
    },
    facebook: {
      type: 'string',
      allowNull: true,
    },
    twitter: {
      type: 'string',
      allowNull: true,
    },
    twitterFollowers: {
      type: 'number',
      allowNull: true,
      defaultsTo: 0
    },
    website: {
      type: 'string',
      allowNull: true,
    },
    campaignWebsite: {
      type: 'string',
      allowNull: true,
    },
  },
  customToJSON: function() {
    // Return a shallow copy of this record with the password removed.
    return _.omit(this, ['createdAt', 'updatedAt']);
  },
};
