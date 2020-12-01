'use strict';

const systemService = require('../services/system');

module.exports = (app) => {
  app.get('/health', systemService.healthStatus);
  app.get('/ready', systemService.readyStatus);
};
