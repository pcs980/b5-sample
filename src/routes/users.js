'use strict';

const userService = require('../services/users');

module.exports = (app) => {
  app.get('/users', userService.get);
  app.post('/users', userService.save);

  app.put('/users/:id', userService.update);
};
