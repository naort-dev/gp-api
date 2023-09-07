const moment = require('moment');

const appBase = sails.config.custom.appBase || sails.config.appBase;

module.exports = {
  inputs: {},

  exits: {
    success: {
      description: 'found',
    },

    badRequest: {
      description: 'Error finding notification',
      responseType: 'badRequest',
    },
  },

  fn: async function (inputs, exits) {
    try {
      let count = 0;
      if (appBase === 'https://goodparty.org') {
        // make sure we run this only once a day
        const today = moment().format('YYYY-MM-DD');
        const key = `updateTracker-${today}`;
        const exists = await KeyValue.findOne({ key });
        if (exists) {
          return exits.badRequest({
            message: 'notification created today already.',
          });
        }
        await KeyValue.create({
          key,
          value: true,
        });
      }

      const candidates = await Candidate.find();
      for (let i = 0; i < candidates.length; i++) {
        const candidate = candidates[i];

        const data = JSON.parse(candidate.data);
        let { electionDate, campaignOnboardingSlug } = data;
        if (!campaignOnboardingSlug) {
          // old candidates
          continue;
        }
        const campaign = await Campaign.findOne({
          slug: campaignOnboardingSlug,
        }).populate('user');
        if (
          !campaign ||
          !campaign.data ||
          !campaign.data.pathToVictory ||
          !campaign.user
        ) {
          continue; // goals not set yet.
        }
        if (!electionDate && campaign.data.goals?.electionDate) {
          electionDate = campaign.data.goals?.electionDate;
          await Candidate.updateOne({
            data: JSON.stringify({
              ...data,
              electionDate,
            }),
          });
        }

        if (!electionDate) {
          continue;
        }

        const now = moment(new Date());
        const nextWeek = moment().add(7, 'days').format('YYYY-MM-DD');
        const end = moment(electionDate);
        const duration = moment.duration(end.diff(now));
        const weeks = Math.floor(duration.asWeeks());
        // const weeks = 11;

        if (weeks >= 0 && weeks <= 12 && campaign) {
          const notification = {
            type: 'goal',
            title: 'Wrapping Up Your Week',
            link: '/dashboard',
            subTitle: 'Time to Update Your Campaign Tracker',
            dueDate: nextWeek,
          };

          await Notification.create({
            isRead: false,
            data: notification,
            user: campaign.user?.id,
          });
          const canEmail = sails.helpers.notification.canEmail(campaign.user);
          if (canEmail) {
            await sendEmail(campaign.user);
          }
          const canText = await sails.helpers.notification.canText(
            campaign.user,
          );

          if (canText) {
            await sails.helpers.sms.sendSms(
              campaign.user.phone,
              `Time to update your Campaign Tracker!
              How many doors did you or your team knock on this week?`,
            );
          }
          count++;
        }
      }

      return exits.success({
        message: `notified ${count} candidates`,
      });
    } catch (e) {
      console.log(e);
      return exits.badRequest({
        message: 'Error creating weekly goals',
      });
    }
  },
};

async function sendEmail(user) {
  if (!user) {
    return;
  }
  const variables = {
    name: `${user.name}`,
  };

  await sails.helpers.mailgun.mailgunTemplateSender(
    user.email,
    'Wrapping Up Your Week - Time to Update Your Campaign Tracker',
    'update-tracker',
    JSON.stringify(variables),
  );
}
