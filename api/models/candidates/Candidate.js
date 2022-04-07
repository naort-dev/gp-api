/**
 * Candidate.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

// this is the new Candidate Model. We will move all the other candidates here.

module.exports = {
  attributes: {
    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝

    firstName: {
      type: 'string',
      required: true,
      description: "Candidate's first name.",
      maxLength: 60,
    },
    lastName: {
      type: 'string',
      required: true,
      description: "Candidate's last name.",
      maxLength: 60,
    },
    isActive: {
      type: 'boolean',
    },
    chamber: {
      type: 'string',
    },
    isOnHomepage: {
      type: 'boolean',
      defaultsTo: false,
    },
    state: {
      type: 'string',
    },
    data: {
      type: 'string',
      description: 'JSON.stringified string of all the other properties',
    },
    contact: {
      type: 'json',
      description: 'contact info',
    },

    // one-to-one
    candidateUgc: {
      collection: 'candidateUgc',
      via: 'candidate',
    },

    // one to many relationship to campaignUpdates
    candidateUpdates: {
      collection: 'campaignupdate',
      via: 'candidate',
    },

    // one to many relationship to endorsements
    endorsements: {
      collection: 'endorsement',
      via: 'candidate',
    },

    // one to many relationship to candidateIssueItem
    candidatePositions: {
      collection: 'candidatePosition',
      via: 'candidate',
    },

    //many to many
    positions: {
      collection: 'position',
      via: 'candidates',
    },
    //many to many
    topIssues: {
      collection: 'topIssue',
      via: 'candidates',
    },

    // one to many relationship to staff members
    staff: {
      collection: 'staff',
      via: 'candidate',
    },

    // one to many relationship to button impression
    buttonImpressions: {
      collection: 'buttonImpression',
      via: 'candidate',
    },
  },

  customToJSON: function() {
    // Return a shallow copy of this record with the password removed.
    return _.omit(this, ['createdAt', 'updatedAt']);
  },
};
