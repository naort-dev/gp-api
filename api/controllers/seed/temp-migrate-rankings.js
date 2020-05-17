module.exports = {
  friendlyName: 'Seed',

  description: 'seed role',

  inputs: {},

  exits: {
    success: {
      description: 'AllCandidates',
    },

    badRequest: {
      description: 'Error seeding database',
      responseType: 'badRequest',
    },
  },

  fn: async function(inputs, exits) {
    try {
      const users = await User.find();
      for (let i = 0; i < users.length; i++) {
        const user = users[i];
        let { presidentialRank, senateRank, houseRank } = user;
        presidentialRank =
          presidentialRank && presidentialRank !== ''
            ? JSON.parse(presidentialRank)
            : [];
        senateRank =
          senateRank && senateRank !== '' ? JSON.parse(senateRank) : [];
        houseRank = houseRank && houseRank !== '' ? JSON.parse(houseRank) : [];

        console.log('p', typeof presidentialRank);
        console.log('s', typeof Object.values(senateRank));
        console.log('h', Object.values(houseRank));

        const senateValues = Object.values(senateRank)[0] || [];
        const houseValues = Object.values(houseRank)[0] || [];
        await migrateChamber(presidentialRank, 'presidential', user);
        await migrateChamber(senateValues, 'senate', user);
        await migrateChamber(houseValues, 'house', user);

        return exits.success({
          seed: `Migrated ${users.length} users`,
        });
      }
    } catch (e) {
      console.log(e);
      return exits.badRequest({
        message: 'Error getting candidates' + JSON.stringify(e),
      });
    }
  },
};

const migrateChamber = async (oldRanking, chamber, user) => {
  for (let i = 0; i < oldRanking.length; i++) {
    if (chamber !== 'presidential') {
      // verify the candidate matches the user district
      const candidate = await RaceCandidate.findOne({ id: oldRanking[i] });
      if (
        !candidate ||
        candidate.district !== user.districtNumber ||
        candidate.state !== user.shortState
      ) {
        continue;
      }
    }
    await Ranking.create({
      user: user.id,
      chamber,
      candidate: oldRanking[i],
      isIncumbent: false,
      rank: i + 1,
    });
  }
};
