'use strict';

const userService = require("./users");
const { QUEUE_BLOCK_USER } = require("../utils/config");

module.exports = (broker) => {
  // Consumir mensagens de fila para bloqueio de usuário
  broker.setupConsumer(QUEUE_BLOCK_USER, userService.block);
};
