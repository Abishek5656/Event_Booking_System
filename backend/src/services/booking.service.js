const { prisma } = require('../config/database');
const AppError = require('../core/errors/AppError');
const { emailQueue } = require('../config/queue');
const logger = require('../core/logger');
const cache = require('../core/cache');

class BookingService {
  async createBooking(customerId, eventId, ticketsCount) {
    // We must handle Optimistic Concurrency Control (Version Locking)

    const MAX_RETRIES = 3;
    let attempts = 0;

    while (attempts < MAX_RETRIES) {
      // 1. Fetch current event state and version
      const event = await prisma.event.findUnique({ where: { id: eventId } });

      if (!event) throw new AppError('Event not found', 404);
      if (event.availableSeats < ticketsCount) {
        throw new AppError('Not enough seats available', 400);
      }

      try {
        // 2. Perform the atomic update with version lock
        const updatedEvent = await prisma.event.update({
          where: {
            id: eventId,
            version: event.version, // Ensure nobody else modified it
          },
          data: {
            availableSeats: event.availableSeats - ticketsCount,
            version: event.version + 1,
          },
        });

        // 3. Create the booking record since we secured the seats
        const booking = await prisma.booking.create({
          data: {
            customerId,
            eventId,
            ticketsCount,
            status: 2, // 2 -> Booked
          },
        });

        // 4. Trigger Email Notification Job
        await emailQueue.add('booking-confirmation', { bookingId: booking.id });

        // 5. Invalidate Event Cache
        cache.del('EVENTS_LIST');
        cache.del(`EVENT_${eventId}`);

        return booking;
      } catch (error) {
        // Prisma throws P2025 if the record to update wasn't found (meaning version mismatched)
        if (error.code === 'P2025') {
          attempts++;
          logger.warn(
            `Concurrency conflict booking event ${eventId}. Retrying (${attempts}/${MAX_RETRIES})...`
          );
          continue; // Retry
        }
        throw error;
      }
    }

    throw new AppError('Server is busy processing other bookings. Please try again.', 409);
  }

  async getMyBookings(customerId) {
    return prisma.booking.findMany({
      where: { customerId },
      include: {
        event: {
          select: { title: true, eventDate: true, venue: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}

module.exports = new BookingService();
