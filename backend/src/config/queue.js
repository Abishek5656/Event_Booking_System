const { Queue } = require('bullmq');
const IORedis = require('ioredis');
const logger = require('../core/logger');

const redisConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  maxRetriesPerRequest: null,
};

const redisConnection = new IORedis(redisConfig);

redisConnection.on('error', (err) => {
  logger.error('Redis connection error:', err);
});

redisConnection.on('ready', () => {
  logger.info('Connected to Redis');
});

// Create Queues
const emailQueue = new Queue('email-notifications', { connection: redisConnection });

module.exports = {
  redisConnection,
  emailQueue,
};
