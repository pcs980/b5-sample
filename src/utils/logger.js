const winston = require('winston');
const env = require('./config');

const levels = [
  'error', // 0
  'warn', // 1
  'info', // 2
  'http', // 3
  'verbose', // 4
  'debug', // 5
  'silly', // 6
];

const logLevel = levels[env.LOG_LEVEL];

const logger = winston.createLogger({
  level: logLevel,
  transports: [
    new winston.transports.Console({
      format: winston.format.json(),
    }),
  ],
});

module.exports = logger;
