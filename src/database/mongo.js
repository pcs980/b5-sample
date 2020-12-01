'use strict';

const mongoose = require('mongoose');
const logger = require('../utils/logger');
const { DATABASE_URI } = require('../utils/config');

let connection;

const isAlive = () => {
  return mongoose.connection.readyState === 1;
}

const connect = async () => {
  if (!connection) {
    mongoose.set('useNewUrlParser', true);
    mongoose.set('useCreateIndex', true);
    mongoose.set('useFindAndModify', false);
    mongoose.set('useUnifiedTopology', true);
    try {
      connection = await mongoose.connect(DATABASE_URI)
      logger.info('Conectado ao Mongo');
    } catch (error) {
      logger.error('Falha ao conectar ao Mongo', error);
    }
  }
}

module.exports = {
  connect,
  isAlive
}
