'use strict';

const UserModel = require('../models/user');
const logger = require('../utils/logger');
const { QUEUE_BLOCK_USER } = require('../utils/config');
const { registerDatabaseTime, registerQueueTime } = require('./metrics');

const TABLE_NAME = 'users';

const get = async (req, res) => {
  const start = process.hrtime();
  const criteria = req.query;

  try {
    logger.debug(`Buscando usuários [${JSON.stringify(criteria)}]`);
    const result = await UserModel.find(criteria).sort({name: 1});
    registerDatabaseTime(200, 'select', TABLE_NAME, '', start);

    res.status(200).json({
      success: true,
      count: result.length,
      data: result
    });
  } catch (error) {
    logger.error('Erro ao obter usuários: ' + error);
    registerDatabaseTime(400, 'select', TABLE_NAME, error.message, start);

    res.status(400).json({
      error: error.message,
      success: false
    });
  }
};

const save = async (req, res) => {
  const start = process.hrtime();
  const user = req.body;

  try {
    const result = await new UserModel(user).save();
    logger.debug('Novo usuário:', result);
    registerDatabaseTime(201, 'insert', TABLE_NAME, '', start);

    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    logger.error('Erro ao salvar usuário: ' + error);
    registerDatabaseTime(400, 'insert', TABLE_NAME, error.message, start);

    res.status(400).json({
      error: error.message,
      success: false,
    });
  }
};

const update = async (req, res) => {
  const start = process.hrtime();
  const { id }= req.params;
  const user = req.body;

  try {
    const result = await UserModel.findOneAndUpdate({'_id': id}, {'$set': user}, {new: true});
    if (result) {
      logger.debug('Usuário atualizado:', result.name);
      registerDatabaseTime(200, 'update', TABLE_NAME, '', start);

      res.status(200).json({
        success: true,
        data: result,
      });
    } else {
      registerDatabaseTime(404, 'update', TABLE_NAME, 'Usuário não encontrado', start);

      res.status(404).json({
        id,
        error: 'Usuário não encontrado',
        success: false
      });
    }
  } catch(error) {
    logger.error('Erro ao atualizar usuário:', error);
    registerDatabaseTime(400, 'update', TABLE_NAME, error.message, start);

    res.status(400).json({
      id,
      error: error.message,
      success: false,
    });
  }
};

// Registra bloqueio recebido por mensagem em fila
const block = async (work) => {
  const start = process.hrtime();
  const { id, blockType } = work.getPayload();
  logger.debug(`Bloqueando usuário Id ${id} com código ${blockType}`);

  if (!id) {
    registerQueueTime('1', QUEUE_BLOCK_USER, 'Id do usuário não informado', start);
    return work.discard();
  } else if (!blockType) {
    registerQueueTime('2', QUEUE_BLOCK_USER, 'Código do tipo de bloqueio não informado', start);
    return work.discard();
  }

  const document = {
    blocked: true,
    block_type: blockType
  };

  try {
    const result = await UserModel.findByIdAndUpdate(id, document, { new: true });

    if (!result) {
      registerQueueTime('3', QUEUE_BLOCK_USER, 'Id do usuário não encontrado', start);
      return work.discard();
    }

    registerQueueTime('ok', QUEUE_BLOCK_USER, '', start);
    return work.done();
  } catch (error) {
    logger.error(`Erro ao bloquear usuário: ${error.message}`);
    registerQueueTime('4', QUEUE_BLOCK_USER, 'Erro ao bloquear usuário', start);
    return work.discard();
  }
};

module.exports = {
  block,
  get,
  save,
  update
};
