/**
 * user/login.js
 *
 * @description :: Server-side controller action for handling incoming requests.
 * @help        :: See https://sailsjs.com/documentation/concepts/actions-and-controllers
 */

module.exports = {
  friendlyName: 'Login user',

  description:
    'Login user with email and password. Return the user and jwt access token.',

  inputs: {
    email: {
      description: 'User Phone',
      type: 'string',
      required: true,
      isEmail: true,
    },
    socialPic: {
      description: 'Avatar Image url',
      type: 'string',
      required: false,
    },
    socialToken: {
      description: 'Social Token that needs to be verified',
      type: 'string',
      required: false,
    },
    socialProvider: {
      description: 'Social provider (facebook, google)',
      type: 'string',
      required: false,
    },
  },

  exits: {
    success: {
      description: 'Returns ok response from api/responses/ok.js',
      responseType: 'ok',
    },
    badRequest: {
      description: 'Phone Format Error',
      responseType: 'badRequest',
    },
  },

  fn: async function (inputs, exits) {
    try {
      const { email, socialPic, socialToken, socialProvider } = inputs;
      const lowerCaseEmail = email.toLowerCase();

      try {
        await sails.helpers.verifySocialToken(
          lowerCaseEmail,
          socialToken,
          socialProvider,
        );
      } catch (e) {
        return exits.badRequest({
          message: 'Invalid Token',
        });
      }

      const user = await User.findOne({ email: lowerCaseEmail });
      if (!user) {
        return exits.badRequest({
          message: `The email ${lowerCaseEmail} is not in our system. Please create an account first.`,
          noUser: true,
        }); //we don't disclose whether we have a user in the db or not
      }
      if (socialPic && !user.avatar) {
        await User.updateOne({ email: lowerCaseEmail }).set({
          avatar: socialPic,
        });
      }

      const token = await sails.helpers.jwtSign({
        id: user.id,
        email: lowerCaseEmail,
      });

      // const userWithZip = await User.findOne({ id: user.id });
      //
      // const zipCode = await ZipCode.findOne({
      //   id: userWithZip.zipCode,
      // }).populate('cds');
      // userWithZip.zipCode = zipCode;

      return exits.success({
        user,
        token,
      });
    } catch (err) {
      console.log('login error');
      console.log(err);
      // await sails.helpers.slack.errorLoggerHelper('Error at entrance/social-login', err);
      return exits.badRequest({
        message: 'Login Error',
      });
    }
  },
};
