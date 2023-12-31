const axios = require('axios');

module.exports = {
  friendlyName: 'Health',

  description: 'root level health check',

  inputs: {},

  exits: {
    success: {
      description: 'Healthy',
    },

    badRequest: {
      description: 'Error getting root health route',
      responseType: 'badRequest',
    },
  },

  fn: async function (inputs, exits) {
    try {
      return exits.success({
        health: 'Welcome to Good Party Api',
      });
    } catch (e) {
      console.log('error at health');
      console.log(e);
      await sails.helpers.slack.errorLoggerHelper('Error at api health', e);
      return exits.badRequest({
        message: 'unknown error',
      });
    }
  },
};
