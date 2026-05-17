const { emailQueue } = require('../../config/queue');
const { prisma } = require('../../config/database');
const emailService = require('../../services/email.service');
const logger = require('../../core/logger');

// Listen to the in-memory queue events
emailQueue.on('job', async (job) => {
  logger.info(`Processing in-memory background job of type ${job.name}`);

  try {
    if (job.name === 'booking-confirmation') {
      const { bookingId } = job.data;

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

      // Send emails to all customers asynchronously
      const promises = bookings.map((b) =>
        emailService.sendEventUpdateNotification(b.customer, event)
      );

      await Promise.all(promises);
      logger.info(`Sent ${promises.length} update notifications for event ${eventId}`);
    }

    logger.info(`In-memory job ${job.name} completed successfully!`);
  } catch (err) {
    logger.error(`In-memory job ${job.name} failed with: ${err.message}`);
  }
});

module.exports = {};
