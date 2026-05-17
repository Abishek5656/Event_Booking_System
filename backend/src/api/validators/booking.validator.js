const { z } = require('zod');
const { VALIDATION_MESSAGES } = require('../../shared/constants');

const createBookingSchema = z.object({
  body: z.object({
    eventId: z.number().int().positive(VALIDATION_MESSAGES.EVENT_ID_POSITIVE),
    ticketsCount: z.number().int().positive(VALIDATION_MESSAGES.TICKETS_COUNT_MIN),
  }),
});

module.exports = {
  createBookingSchema,
};
