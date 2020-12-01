'use strict';

const { MessageBrokerClient } = require('broker-client');
const { AMQP_URL } = require('../utils/config');

const broker = new MessageBrokerClient({
  brokerURL: AMQP_URL,
  serviceName: 'b5-sample'
});

const isReady = () => {
  return broker.isReady();
};

const start = async () => {
  await broker.init();
  return broker;
}

module.exports = {
  start,
  isReady
};
