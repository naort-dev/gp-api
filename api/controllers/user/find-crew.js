/**
 * user/find-crew.js
 *
 * @description :: Receiving contacts array and returning a hash with matching users in our system
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
module.exports = {
  friendlyName: 'Find Crew',

  description:
    'Receiving contacts array and returning a hash with matching users in our system',

  inputs: {
    contacts: {
      description: 'Contacts from phone',
      type: ['json'],
      required: true
    },
  },

  exits: {
    success: {
      description: 'Crew Found.',
      responseType: 'ok',
    },
    badRequest: {
      description: 'Error finding crew',
      responseType: 'badRequest',
    },
  },

  fn: async function(inputs, exits) {
    try {
      const { contacts } = inputs;
      const contactsPhones = [];
      const contactsPhonesToIds = {};
      const crew = {};
      const dbCrew = [];
      let contact;
      for (let i = 0; i < contacts.length; i++) {
        contact = contacts[i];
        if (contact.id && contact.phone) {
          contactsPhones.push(contact.phone);
          contactsPhonesToIds[contact.phone] = {
            id: contact.id,
            name: fullFirstLastInitials(contact.name),
          };
        }
      }

      const users = await User.find({ phone: contactsPhones })
        .populate('congDistrict')
        .populate('zipCode')
        .populate('recruits');
      for (let i = 0; i < users.length; i++) {
        const user = users[i];
        const contactId = contactsPhonesToIds[user.phone].id;
        crew[contactId] = {
          id: user.id,
          congDistrict: user.congDistrict,
          image: user.avatar,
          feedback: user.feedback,
          name: contactsPhonesToIds[user.phone].name,
          recruits: user.recruits ? user.recruits.length : 0,
          zipCode: user.zipCode,
        };
        dbCrew.push(user.id);
      }

      const user = this.req.user;
      await User.updateOne({ id: user.id }).set({
        crew: JSON.stringify(dbCrew),
      });

      return exits.success({
        crew,
      });
    } catch (e) {
      console.log('error at find crew');
      console.log(e);
      return exits.badRequest({
        message: 'Error finding crew',
      });
    }
  },
};

const fullFirstLastInitials = name => {
  if (!name || typeof name !== 'string') {
    return '';
  }
  const names = name.split(' ');
  if (names.length > 1) {
    return `${names[0]} ${names[names.length - 1].charAt(0)}`;
  }
  if (names.length === 1) {
    return names[0];
  }
  return '';
};
