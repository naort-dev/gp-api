// https://developers.hubspot.com/docs/api/crm/contacts
const hubspot = require('@hubspot/api-client');

const hubSpotToken =
  sails.config.custom.hubSpotToken || sails.config.hubSpotToken;

module.exports = {
  inputs: {
    user: {
      type: 'json',
      required: true,
    },
    candidate: {
      type: 'json',
      required: true,
    },
    remove: {
      type: 'boolean',
    },
  },
  exits: {
    success: {
      description: 'ok',
    },

    badRequest: {
      description: 'Error',
    },
  },
  fn: async function (inputs, exits) {
    try {
      if (!hubSpotToken) {
        // for non production env.
        return exits.success('no api key');
      }

      const hubspotClient = new hubspot.Client({ accessToken: hubSpotToken });

      const { user, candidate, remove } = inputs;
      let contactId;
      if (user.metaData) {
        const metaData = JSON.parse(user.metaData);
        if (metaData.hubspotId) {
          contactId = metaData.hubspotId;
        }
      }

      if (!contactId) {
        await sails.helpers.crm.updateUser(user);
        // updateUser doesn't return the hubspot id so we fetch it.
        const updatedUser = await User.findOne({ id: user.id });
        if (updatedUser.metaData) {
          const metaData = JSON.parse(updatedUser.metaData);
          if (metaData.hubspotId) {
            contactId = metaData.hubspotId;
          }
        }
      }

      let companyId = candidate.contact ? candidate.contact.hubspotId : false;
      if (!companyId) {
        companyId = await sails.helpers.crm.updateCandidate(candidate);
      }

      if (remove) {
        await hubspotClient.crm.companies.associationsApi.archive(
          companyId,
          'contacts',
          contactId,
          'company_to_contact',
        );
      } else {
        await hubspotClient.crm.companies.associationsApi.create(
          companyId,
          'contacts',
          contactId,
          'company_to_contact',
        );

        await sails.helpers.crm.updateUser(user);
      }

      return exits.success('ok');
    } catch (e) {
      console.log('hubspot error associate-user-candidate', e);
      await sails.helpers.slack.errorLoggerHelper(
        'error in associateUserCandidate',
        e,
      );
      return exits.success('not ok');
    }
  },
};
