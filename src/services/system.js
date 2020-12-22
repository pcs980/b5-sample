'use strict';

const mongo = require('../database/mongo');
const queue = require('./queue');

const readyStatus = (req, res) => {
  res.status(200).json({
    ready: true
  });
};

const healthStatus = (req, res) => {
  const mongoAlive = mongo.isAlive();
  const brokerAlive = queue.isReady();

  const appHealthy = mongoAlive && brokerAlive;
  const status = appHealthy ? 200 : 503;

  res.status(status).json({
    healthy: appHealthy,
    database: mongoAlive,
    queue: brokerAlive
  });
};

module.exports = {
  healthStatus,
  readyStatus
};