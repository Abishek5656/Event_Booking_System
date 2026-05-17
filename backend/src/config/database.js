const { PrismaClient } = require('@prisma/client');
const logger = require('../core/logger');

const prisma = new PrismaClient({
  log: [
    { emit: 'event', level: 'query' },
    { emit: 'stdout', level: 'error' },
    { emit: 'stdout', level: 'info' },
    { emit: 'stdout', level: 'warn' },
  ],
});

prisma.$on('query', (e) => {
  if (process.env.NODE_ENV === 'development') {
    logger.info(`Query: ${e.query}`);
    logger.info(`Duration: ${e.duration}ms`);
  }
});

async function connectDatabase() {
  try {
    await prisma.$connect();
    logger.info('Successfully connected to the database.');
  } catch (error) {
    logger.error('Failed to connect to the database', error);
    process.exit(1);
  }
}

module.exports = { prisma, connectDatabase };
