'use strict';

const { Monitor } = require('@labbsr0x/express-monitor');
const packageJson = require('../../package.json');
const mongo = require('../database/mongo');
const queue = require('../services/queue');

const registerDatabaseTime = (status, method, table, error = '', start) => {
  Monitor.collectDependencyTime('DATABASE', 'odbc', status, method, table, error, start);
};

const registerQueueTime = (status, queueName, error = '', start) => {
  Monitor.collectRequestTime('amqp', status, queueName, start, error);
};

const init = (app) => {
  Monitor.init(app, true, [0.01, 0.05, 0.1, 0.5, 1, 1.5, 3], packageJson.version);

  Monitor.watchDependencies(async (register) => {
    register({
      name: 'database',
      up: mongo.isAlive()
    });

    register({
      name: 'queue',
      up: queue.isReady()
    })
  });
};

module.exports = {
  init,
  registerDatabaseTime,
  registerQueueTime
};
