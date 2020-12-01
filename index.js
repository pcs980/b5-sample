'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const metrics = require('./src/services/metrics');
const database = require('./src/database/mongo');
const queue = require('./src/services/queue');
const consumers = require('./src/services/consumers');

const app = express();
app.use(bodyParser.text());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Inicializa utilitário para métricas
metrics.init(app);

// Preparar endpoints
require('./src/routes/users')(app);
require('./src/routes/system')(app);

// Inicia atendimento
const { PORT } = require('./src/utils/config');
app.listen(PORT, async () => {
  // Conecta ao Mongo
  await database.connect();

  // Assinar tópicos de mensagens
  const broker = await queue.start();
  consumers(broker);

  console.log(`Aplicativo atendendo na porta ${PORT}`);
});
