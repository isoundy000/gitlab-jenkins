'use strict';

module.exports = appInfo => {
  const config = exports = {};
  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1534240235695_3512';
  config.gitlabHost = 'gitlab.zudeapp.com';
  config.jenkinsApi = 'http://jenkins:f8de79b1eaad0d4315b6ba97937143a4@192.168.0.70:8080/jenkins';
  config.jenkinsPath = 'http://192.168.0.70:8080';
  config.jenkinsToken = 'token';
  // add your config here
  config.middleware = [];

  return config;
};
