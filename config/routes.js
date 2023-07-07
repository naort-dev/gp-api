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
  'GET    /': 'general/health',
  'GET    /api/v1/seed': 'seed/seed',
  'GET    /api/v1/content/all-content': 'content/all-content',
  'GET    /api/v1/content/content-by-key': 'content/content-by-key',
  'GET    /api/v1/content/update': 'content/update',

  'PUT    /api/v1/entrance/login': 'entrance/login',
  'PUT    /api/v1/entrance/social-login': 'entrance/social-login',
  // 'GET    /api/v1/entrance/verify-recaptcha': 'entrance/verify-recaptcha',
  'PUT    /api/v1/entrance/twitter-login': 'entrance/twitter-login',
  'PUT    /api/v1/entrance/twitter-confirm': 'entrance/twitter-confirm',
  'POST   /api/v1/entrance/register': 'entrance/register',
  'POST   /api/v1/entrance/send-password-recovery-email':
    'entrance/send-password-recovery-email',
  'PUT   /api/v1/entrance/reset-password': 'entrance/reset-password',

  'PUT    /api/v1/user/update-user': 'user/update-user',
  'DELETE    /api/v1/user': 'user/delete',
  // 'POST    /api/v1/user/avatar': 'user/upload-avatar',
  'POST    /api/v1/user/avatar': 'user/upload-image',
  'PUT   /api/v1/user/password': 'user/password/update',
  'GET   /api/v1/user/campaign-status': 'user/campaign-status',

  'POST   /api/v1/support': 'user/support/create',
  'DELETE   /api/v1/support': 'user/support/delete',
  'GET   /api/v1/supports': 'user/support/list-by-user',
  // 'GET   /api/v1/candidate-supports': 'user/support/list-by-candidate',

  'GET    /api/v1/admin/candidates': 'admin/candidate/list',
  'GET    /api/v1/admin/users': 'admin/all-users',
  'DELETE    /api/v1/admin/user': 'admin/delete-user',
  'POST   /api/v1/admin/user/impersonate': 'admin/impersonate-user',
  'POST   /api/v1/admin/uploaded-images': 'admin/uploaded-images',
  'POST   /api/v1/admin/upload-image': 'admin/upload-image',
  // for campaign
  'POST    /api/v1/admin/victory-mail': 'admin/victory-mail',
  'PUT    /api/v1/admin/deactivate-candidate-by-campaign':
    'admin/candidate/deactivate-candidate-by-campaign',

  // New Candidates
  'POST   /api/v1/new-candidate': 'newCandidates/create',
  'GET    /api/v1/new-candidate': 'newCandidates/find',
  'PUT    /api/v1/new-candidate': 'newCandidates/update',

  'GET    /api/v1/homepage-candidates': 'newCandidates/homepage-candidates',
  'GET    /api/v1/new-candidates': 'newCandidates/list',
  'DELETE    /api/v1/new-candidate': 'newCandidates/delete',
  'GET    /api/v1/new-candidate/can-edit': 'newCandidates/can-edit',

  'GET   /api/v1/subscribe/email': 'subscribe/subscribe-email',

  'GET   /api/v1/user/staff': 'user/staff',

  'POST   /api/v1/visit': 'visit/create',

  // campaign
  'GET    /api/v1/campaign': 'campaign/find',
  'PUT    /api/v1/campaign': 'campaign/update',
  'GET    /api/v1/campaign/stats': 'campaign/stats',

  'GET    /api/v1/campaign/staff-role': 'campaign/staff/find',

  'POST   /api/v1/campaign/endorsement': 'campaign/endorsement/create',
  'GET    /api/v1/campaign/endorsements': 'campaign/endorsement/list',
  'DELETE    /api/v1/campaign/endorsement': 'campaign/endorsement/delete',
  'PUT    /api/v1/campaign/endorsement': 'campaign/endorsement/update',
  'POST   /api/v1/campaign/image': 'campaign/image/create',
  'POST    /api/v1/campaign/claim': 'campaign/claim/claim',
  'PUT   /api/v1/campaign/approve-claim': 'campaign/claim/approve-claim',

  'DELETE   /api/v1/campaign/onboarding': 'campaign/onboarding/delete',
  'DELETE   /api/v1/campaign': 'campaign/onboarding/admin-delete',
  'POST   /api/v1/campaign/onboarding': 'campaign/onboarding/create',
  'PUT   /api/v1/campaign/onboarding': 'campaign/onboarding/update',
  'GET   /api/v1/campaign/onboarding/by-user':
    'campaign/onboarding/find-by-user',
  'GET   /api/v1/campaign/onboarding/by-slug':
    'campaign/onboarding/find-by-slug', //admin
  'GET   /api/v1/campaign/onboardings': 'campaign/onboarding/list',
  'POST   /api/v1/campaign/onboarding/launch-request':
    'campaign/onboarding/launch-request',
  'DELETE   /api/v1/campaign/onboarding/launch-request':
    'campaign/onboarding/cancel-launch-request',
  'POST   /api/v1/campaign/onboarding/launch': 'campaign/onboarding/launch', // admin

  // onboarding AI
  'POST   /api/v1/campaign/onboarding/ai': 'campaign/onboarding/ai/create',
  'PUT   /api/v1/campaign/onboarding/ai': 'campaign/onboarding/ai/edit',
  'POST   /api/v1/campaign/onboarding/fast-ai':
    'campaign/onboarding/ai/create-no-queue',
  'GET   /api/v1/campaign/onboarding/planVersion':
    'campaign/onboarding/planVersion/find',

  'GET   /api/v1/top-issues': 'topIssues/topIssue/list',
  'POST   /api/v1/top-issue': 'topIssues/topIssue/create',
  'PUT   /api/v1/top-issue': 'topIssues/topIssue/update',
  'DELETE   /api/v1/top-issue': 'topIssues/topIssue/delete',

  // position
  'GET   /api/v1/positions': 'topIssues/position/list',
  'POST   /api/v1/position': 'topIssues/position/create',
  'PUT   /api/v1/position': 'topIssues/position/update',
  'DELETE   /api/v1/position': 'topIssues/position/delete',

  // candidatePositions
  'GET   /api/v1/candidate-positions': 'topIssues/candidatePosition/list',
  'POST   /api/v1/candidate-position': 'topIssues/candidatePosition/create',
  'PUT   /api/v1/candidate-position': 'topIssues/candidatePosition/update',
  'DELETE   /api/v1/candidate-position': 'topIssues/candidatePosition/delete',
  'GET  /api/v1/candidate-position':
    'topIssues/candidatePosition/find-by-candidate',

  // application

  'POST   /api/v1/application/upload-image':
    'newCandidates/application/upload-image',

  // socialListening

  'GET   /api/v1/listening/followers-count': 'socialListening/followers-count',
  // 'GET   /api/v1/listening/tiktok-scrape': 'socialListening/tiktok-scrape',
  // 'GET   /api/v1/listening/search-results': 'socialListening/search-results',

  'GET   /api/v1/declares': 'declare/list',

  // socialListening crons
  // 'GET   /api/v1/listening/cron/searches': 'socialListening/cron/searches',
  // 'GET   /api/v1/listening/cron/followers': 'socialListening/cron/followers',
  // 'GET   /api/v1/listening/cron/brands': 'socialListening/cron/brands',
  // 'GET   /api/v1/listening/cron/candidates-tiktok-scrape':
  //   'socialListening/cron/candidates-tiktok-scrape',
  // 'GET   /api/v1/listening/cron/update-candidates-feed':
  //   'socialListening/cron/update-candidates-feed',
};
