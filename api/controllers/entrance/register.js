/**
 * entrance/register.js
 *
 * @description :: Stand Alone action2 for signing up a user.
 * @help        :: See https://sailsjs.com/documentation/concepts/actions-and-controllers
 */


module.exports = {
  friendlyName: 'register user',

  description: 'register a user with email and name',

  inputs: {
    email: {
      description: 'User Email',
      type: 'string',
      required: true,
      isEmail: true,
    },
    password: {
      description: 'User Password',
      type: 'string',
      required: false,
    },
    name: {
      description: 'User Name',
      type: 'string',
      required: true,
    },
    verify: {
      description: 'Send an email?',
      type: 'boolean',
      defaultsTo: true,
      required: false,
    },
    districtId: {
      description: 'Selected district id',
      type: 'number',
      required: false,
    },
    addresses: {
      description: 'Addresses collected from user during account creation.',
      type: 'string',
      required: false,
    },
    zip: {
      description: 'zip collected from user during account creation.',
      type: 'string',
      required: false,
    },

    ranking: {
      description: 'stringified array of Ranking objects',
      type: 'string',
      required: false,
    },

    socialId: {
      type: 'string',
      required: false,
      description: 'Social Channel Id',
    },

    socialProvider: {
      type: 'string',
      required: false,
      description: 'Social Channel',
    },
    socialPic: {
      type: 'string',
      required: false,
      description: 'Social Channel profile image url',
    },
    socialToken: {
      description: 'Social Token that needs to be verified',
      type: 'string',
      required: false,
    },
    referrer: {
      description: 'uuid of the inviting user',
      type: 'string',
      required: false,
    },
    guestUuid: {
      description: 'uuid that was generated on the front end',
      type: 'string',
      required: false,
    },
  },

  exits: {
    success: {
      description: 'User Created',
      responseType: 'ok',
    },
    badRequest: {
      description: 'register Failed',
      responseType: 'badRequest',
    },
  },
  fn: async function (inputs, exits) {
    // Look up the user whose ID was specified in the request.
    // Note that we don't have to validate that `userId` is a number;
    // the machine runner does this for us and returns `badRequest`
    // if validation fails.
    try {
      const {
        email,
        password,
        name,
        verify,
        addresses,
        zip,
        ranking,
        socialId,
        socialProvider,
        socialPic,
        socialToken,
        referrer,
        guestUuid,
      } = inputs;

      let { districtId } = inputs;
      const lowerCaseEmail = email.toLowerCase();

      const userExists = await User.findOne({
        email: lowerCaseEmail,
      });
      if (userExists) {
        return exits.badRequest({
          message: `${lowerCaseEmail} already exists in our system.`,
          exists: true,
        });
      }

      let displayAddress, normalizedAddress, addressZip;
      if (addresses) {
        const address = JSON.parse(addresses);
        displayAddress = address.displayAddress;
        normalizedAddress = address.normalizedAddress
          ? JSON.stringify(address.normalizedAddress)
          : address.normalizedAddress;
        addressZip = address.zip;
      }
      let zipCode;

      if (addressZip) {
        zipCode = await ZipCode.findOne({ addressZip });
      } else if (zip) {
        zipCode = await ZipCode.findOne({ zip });
      }

      const userAttr = {
        email: lowerCaseEmail,
        name,
      };
      if (password) {
        userAttr.password = password;
      }
      if (zipCode) {
        userAttr.zipCode = zipCode.id;
        userAttr.shortState = zipCode.stateShort;
      }
      if (zipCode && !districtId) {
        // districtId wasn't specified - take the first one in the array
        let { approxPctArr } = zipCode;
        if (approxPctArr) {
          approxPctArr = JSON.parse(approxPctArr);
          if (approxPctArr.length > 0) {
            districtId = approxPctArr[0].districtId;
          }
        }
      }

      if (districtId) {
        const congDistrict = await CongDistrict.findOne({ id: districtId });
        userAttr.congDistrict = districtId;
        userAttr.districtNumber = congDistrict.code;
      }

      if (displayAddress) {
        userAttr.displayAddress = displayAddress;
      }
      if (normalizedAddress) {
        userAttr.normalizedAddress = normalizedAddress;
      }

      if (verify) {
        userAttr.isEmailVerified = false;
      }
      if (socialId) {
        userAttr.socialId = socialId;
      }
      if (socialProvider) {
        userAttr.socialProvider = socialProvider;
      }
      if (socialPic) {
        userAttr.avatar = socialPic;
      }
      if (referrer) {
        const referrerUser = await User.findOne({ uuid: referrer });
        if (referrerUser) {
          userAttr.referrer = referrerUser.id;
          await User.updateOne({ id: referrerUser.id }).set({
            crewCount: referrerUser.crewCount ? referrerUser.crewCount + 1 : 2,
          });
        } else {
          // invited by a guest with a referrer (uuid) that was generated on the front end.
          userAttr.guestReferrer = referrer;
        }
      }
      if (socialPic || socialProvider || socialId) {
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
      }

      const uuid =
        guestUuid ||
        Math.random()
          .toString(36)
          .substring(2, 12);

      const user = await User.create({
        uuid,
        ...userAttr,
      }).fetch();

      // find all the users that were invited by this user
      const referredUsers = await User.find({ guestReferrer: uuid });
      for (let i = 0; i < referredUsers.length; i++) {
        const referredUser = referredUsers[i];
        await User.updateOne({ id: referredUser.id }).set({
          referrer: user.id,
          guestReferrer: '',
        });
      }
      //add crewCount from refferedUsers
      if (referredUsers.length > 0) {
        user.crewCount = referredUsers.length;
      }
      try {
        // convert the guest ranking (from cookies) to actual ranking in our system.
        if (ranking) {
          const rankingArr = JSON.parse(ranking);
          for (let i = 0; i < rankingArr.length; i++) {
            const { chamber, candidate, isIncumbent, rank } = rankingArr[i];
            await Ranking.create({
              user: user.id,
              chamber,
              candidate,
              rank,
              isIncumbent,
              userState: user.shortState ? user.shortState : '',
            });
          }
        }
      } catch (e) {
        // do nothing. Usually the error is for missing state.
      }

      const userWithZip = await User.findOne({ id: user.id });

      const userZipCode = await ZipCode.findOne({
        id: userWithZip.zipCode,
      }).populate('cds');
      userWithZip.zipCode = userZipCode;

      if (!socialPic && !socialProvider && !socialId) {
        // send sms to the newly created user.
        const appBase = sails.config.custom.appBase || sails.config.appBase;
        const subject = `${user.firstName || user.name}, please verify your email address`;
        const message = `<table border="0" cellpadding="0" cellspacing="0" height="100%" width="100%">
          <tbody>
            <tr>
              <td>
                <p
                  style="
                    font-size: 16px;
                    font-family: Arial, sans-serif;
                    margin-top: 0;
                    margin-bottom: 5px;
                  "
                >
                  Hi ${user.firstName || user.name}!<br /><br />
                </p>
              </td>
            </tr>
            <tr>
              <td>
                <p
                  style="
                    font-size: 16px;
                    font-family: Arial, sans-serif;
                    margin-top: 0;
                    margin-bottom: 5px;
                  "
                >
                  We need to know you’re not a bot and to be able to reach you with
                  important campaign updates.
                </p>
              </td>
            </tr>
            <tr>
              <td>
                <p
                  style="
                    font-size: 16px;
                    font-family: Arial, sans-serif;
                    margin-top: 0;
                    margin-bottom: 5px;
                  "
                >
                  <br/>
                  Please click below to verify your email address.
                </p>
              </td>
            </tr>
            <tr>
              <td>
                <br /><br /><a
                  href="${appBase}/email-confirmation?email=${lowerCaseEmail}&token=${user.emailConfToken}"
                  style="
                    padding: 16px 32px;
                    background: linear-gradient(
                        103.63deg,
                        rgba(255, 15, 19, 0.15) -3.51%,
                        rgba(191, 0, 32, 0) 94.72%
                      ),
                      linear-gradient(
                        257.82deg,
                        rgba(67, 0, 211, 0.25) -11.17%,
                        rgba(67, 0, 211, 0) 96.34%
                      ),
                      #5c00c7;
                    color: #fff;
                    font-size: 16px;
                    border-radius: 8px;
                    text-decoration: none;
                  "
                >
                  CLICK TO VERIFY
                </a>
              </td>
            </tr>
          </tbody>
        </table>
        `;
        const messageHeader = '';
        await sails.helpers.mailgunSender(
          lowerCaseEmail,
          name,
          subject,
          messageHeader,
          message,
        );
      }
      try {
        await sails.helpers.addEmail(lowerCaseEmail, 'The Good Party');
      } catch (e) { }
      const token = await sails.helpers.jwtSign({
        id: user.id,
        email: lowerCaseEmail,
      });

      return exits.success({
        user: userWithZip,
        token,
      });
    } catch (e) {
      await sails.helpers.errorLoggerHelper('Error at entrance/register', e);
      console.log('register error', e);
      return exits.badRequest({ message: 'Error registering account.' });
    }
  },
};
