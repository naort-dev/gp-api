module.exports = {
  attributes: {
    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝
    slug: {
      type: 'string',
      required: true,
      unique: true,
    },
    isActive: {
      type: 'boolean',
    },
    data: {
      type: 'json',
    },

    user: {
      model: 'user',
    },

    campaignsUpdateHistories: {
      collection: 'campaignUpdateHistory',
      via: 'campaign',
    },

    campaignPlanVersions: {
      collection: 'campaignPlanVersion',
      via: 'campaign',
    },
  },
};
