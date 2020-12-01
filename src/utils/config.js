module.exports = {
  PORT: process.env.PORT || 5000,
  AMQP_URL: process.env.AMQP_URL || 'amqp://localhost',
  QUEUE_BLOCK_USER: 'security-block-user',
  DATABASE_URI: process.env.DATABASE_URI || 'mongodb://localhost:27017/b5',
  LOG_LEVEL: process.env.LOG_LEVEL || '5'
};
