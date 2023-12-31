let twilioClient;
module.exports = {
  friendlyName: 'Send SMS helper',

  description: 'Send SMS using twilio API',

  inputs: {
    phone: {
      friendlyName: 'Phone to verify',
      description: 'User Phone Number to verify with sms.',
      type: 'string',
    },
    message: {
      friendlyName: 'Message to send',
      description: 'Message to send',
      type: 'string',
    },
  },

  fn: async function (inputs, exits) {
    try {
      const twilioSID = sails.config.custom.twilioSID || sails.config.twilioSID;
      const twilioAuthToken =
        sails.config.custom.twilioAuthToken || sails.config.twilioAuthToken;

      if (!twilioClient) {
        twilioClient = require('twilio')(twilioSID, twilioAuthToken);
      }

      let cleanPhone = inputs.phone.replace(/\D+/g, '');
      if (cleanPhone.charAt(0) !== 1) {
        cleanPhone = `1${cleanPhone}`;
      }

      const verification = await twilioClient.messages.create({
        body: inputs.message,
        from: '+17402004839',
        to: cleanPhone,
      });
      if (verification) {
        return exits.success({ sid: verification.sid });
      }
      console.log('failed to send sms');
      return exits.success(false);
    } catch (e) {
      console.log('failed to send sms', e);
      return exits.success(false);
    }
  },
};
