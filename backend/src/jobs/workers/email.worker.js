const { Worker } = require('bullmq');
const { redisConnection } = require('../../config/queue');
const { prisma } = require('../../config/database');
const emailService = require('../../services/email.service');
const logger = require('../../core/logger');

const emailWorker = new Worker(
  'email-notifications',
  async (job) => {
    logger.info(`Processing job ${job.id} of type ${job.name}`);

    if (job.name === 'booking-confirmation') {
      const { bookingId } = job.data;

      const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
        include: { user: true, event: true }, // Wait, user is named `customer` in schema.
      });

      // Let's refetch safely
      const bookingRecord = await prisma.booking.findUnique({
        where: { id: bookingId },
        include: { customer: true, event: true },
      });

      if (!bookingRecord) throw new Error(`Booking ${bookingId} not found`);

      await emailService.sendBookingConfirmation(
        bookingRecord.customer,
        bookingRecord.event,
        bookingRecord
      );
    }

    if (job.name === 'event-update-notification') {
      const { eventId } = job.data;

      const event = await prisma.event.findUnique({ where: { id: eventId } });
      if (!event) throw new Error(`Event ${eventId} not found`);

      // Find all customers who booked this event
      const bookings = await prisma.booking.findMany({
        where: { eventId: eventId },
        include: { customer: true },
      });

      // Send emails to all customers
      // In production, this should be chunked/batched.
      const promises = bookings.map((b) =>
        emailService.sendEventUpdateNotification(b.customer, event)
      );

      await Promise.all(promises);
      logger.info(`Sent ${promises.length} update notifications for event ${eventId}`);
    }
  },
  { connection: redisConnection }
);

emailWorker.on('completed', (job) => {
  logger.info(`Job ${job.id} has completed!`);
});

emailWorker.on('failed', (job, err) => {
  logger.error(`Job ${job.id} has failed with ${err.message}`);
});

module.exports = emailWorker;
