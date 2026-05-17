const { prisma } = require('../config/database');
const AppError = require('../core/errors/AppError');
const { emailQueue } = require('../config/queue');
const cache = require('../core/cache');

class EventService {
  async createEvent(data, organizerId) {
    const event = await prisma.event.create({
      data: {
        ...data,
        availableSeats: data.totalSeats,
        organizerId,
      },
    });

    // Invalidate list cache
    cache.del('EVENTS_LIST');
    return event;
  }

  async getAllEvents() {
    const cachedEvents = cache.get('EVENTS_LIST');
    if (cachedEvents) return cachedEvents;

    const events = await prisma.event.findMany({
      select: {
        id: true,
        title: true,
        venue: true,
        eventDate: true,
        availableSeats: true,
      },
      orderBy: { eventDate: 'asc' },
    });

    cache.set('EVENTS_LIST', events);
    return events;
  }

  async getEventById(id) {
    const cacheKey = `EVENT_${id}`;
    const cachedEvent = cache.get(cacheKey);
    if (cachedEvent) return cachedEvent;

    const event = await prisma.event.findUnique({
      where: { id: parseInt(id) },
      include: { organizer: { select: { name: true, email: true } } },
    });

    if (!event) throw new AppError('Event not found', 404);

    cache.set(cacheKey, event);
    return event;
  }

  async updateEvent(id, data, organizerId) {
    const eventId = parseInt(id);

    // 1. Verify ownership
    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event) throw new AppError('Event not found', 404);

    if (event.organizerId !== organizerId) {
      throw new AppError('You can only update your own events', 403);
    }

    // 2. Adjust availableSeats if totalSeats is updated
    let newAvailableSeats = event.availableSeats;
    if (data.totalSeats !== undefined) {
      const difference = data.totalSeats - event.totalSeats;
      newAvailableSeats += difference;

      if (newAvailableSeats < 0) {
        throw new AppError('Cannot reduce total seats below currently booked tickets', 400);
      }
      data.availableSeats = newAvailableSeats;
    }

    // 3. Update Event
    const updatedEvent = await prisma.event.update({
      where: { id: eventId },
      data,
    });

    // 4. Trigger Background Job to notify customers
    await emailQueue.add('event-update-notification', { eventId });

    // 5. Invalidate caches
    cache.del('EVENTS_LIST');
    cache.del(`EVENT_${eventId}`);

    return updatedEvent;
  }
}

module.exports = new EventService();
