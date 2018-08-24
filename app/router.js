'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/webhook.json', controller.home.webhook);
  router.get('/createJenkins.json', controller.home.createJenkins);
};
