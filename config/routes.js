/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {

  //  ╔═╗╔═╗╦  ╔═╗╔╗╔╔╦╗╔═╗╔═╗╦╔╗╔╔╦╗╔═╗
  //  ╠═╣╠═╝║  ║╣ ║║║ ║║╠═╝║ ║║║║║ ║ ╚═╗
  //  ╩ ╩╩  ╩  ╚═╝╝╚╝═╩╝╩  ╚═╝╩╝╚╝ ╩ ╚═╝

  'PUT    /api/v1/entrance/login':                        'entrance/login',
  'POST   /api/v1/entrance/register':                     'entrance/register',
  'GET    /api/v1/user/check':                            'user/check',
  'POST   /api/v1/entrance/send-password-recovery-email': 'entrance/send-password-recovery-email',
  'POST   /api/v1/entrance/update-password-and-login':    'entrance/update-password-and-login',
  'POST   /api/v1/role':                                  'role/create',

};
