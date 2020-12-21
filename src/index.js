'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const metrics = require('./services/metrics');
const database = require('./database/mongo');
const queue = require('./services/queue');
const consumers = require('./services/consumers');

const app = express();
app.use(bodyParser.text());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Inicializa utilitário para métricas
metrics.init(app);

// Preparar endpoints
require('./routes/users')(app);
require('./routes/system')(app);

// Inicia atendimento
const { PORT } = require('./utils/config');
app.listen(PORT, async () => {
  // Conecta ao Mongo
  await database.connect();

  // Assinar tópicos de mensagens
  const broker = await queue.start();
  consumers(broker);

  console.log(`Aplicativo atendendo na porta ${PORT}`);
});
