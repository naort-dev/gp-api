const moment = require('moment');

module.exports = {
  friendlyName: 'Count followers for a candidate',

  inputs: {
    candidate: {
      type: 'ref',
    },
  },

  fn: async function(inputs, exits) {
    try {
      const { candidate } = inputs;
      const candidateData = JSON.parse(candidate.data);

      const today = moment().format('YYYY-MM-DD');
      const name = `${candidateData.firstName} ${candidateData.lastName}`;
      const brand = await SocialBrand.findOne({ name });
      let followers = { thisWeek: 0, lastWeek: 0 };
      if (brand) {
        const currentFollowers = await SocialStat.find({
          socialBrand: brand.id,
          date: today,
        });

        const lastWeek = moment()
          .subtract(7, 'days')
          .format('YYYY-MM-DD');
        const lastWeekFollowers = await SocialStat.find({
          socialBrand: brand.id,
          date: lastWeek,
        });

        let totalFollowers = 0;
        currentFollowers.forEach(item => {
          totalFollowers += item.count;
        });

        let totalLastWeek = 0;
        lastWeekFollowers.forEach(item => {
          totalLastWeek += item.count;
        });
        let offset = candidateData.followersOffset || 0;
        //temporary tiktok fix
        let tiktokFollowers = candidateData.tiktokFollowers || 0;

        followers.thisWeek = tiktokFollowers + totalFollowers + offset;
        followers.lastWeek = tiktokFollowers + totalLastWeek + offset;
      }

      return exits.success(followers);
    } catch (e) {
      console.log(
        'error at helpers/socialListening/candidate-followers-helper',
        e,
      );
      return exits.success({});
    }
  },
};
