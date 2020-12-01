'use strict';

const mongo = require('../database/mongo');

const readyStatus = (req, res) => {
  res.status(200).json({
    ready: true
  });
};

const healthStatus = (req, res) => {
  res.status(200).json({
    healthy: true,
    database: mongo.isAlive()
  });
};

module.exports = {
  healthStatus,
  readyStatus
};