'use strict';

const { Monitor } = require('@labbsr0x/express-monitor');
const packageJson = require('../../package.json');
const mongo = require('../database/mongo');
const queue = require('../services/queue');

// Registrar tempo para interações com o banco de dados
const registerDatabaseTime = (status, method, table, error = '', start) => {
  Monitor.collectDependencyTime('database', 'odbc', status, method, table, error, start);
};

// Registrar tempo para processar requisições da fila
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
      name: 'amqp',
      up: queue.isReady()
    })
  });
};

module.exports = {
  init,
  registerDatabaseTime,
  registerQueueTime
};
