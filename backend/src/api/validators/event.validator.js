const { z } = require('zod');
const { VALIDATION_MESSAGES } = require('../../shared/constants');

const createEventSchema = z.object({
  body: z.object({
    title: z.string().min(3, VALIDATION_MESSAGES.TITLE_MIN_LENGTH),
    description: z.string().min(10, VALIDATION_MESSAGES.DESCRIPTION_MIN_LENGTH),
    venue: z.string().min(3, VALIDATION_MESSAGES.VENUE_MIN_LENGTH),
    eventDate: z.string().datetime(VALIDATION_MESSAGES.INVALID_DATETIME),
    totalSeats: z.number().int().positive(VALIDATION_MESSAGES.TOTAL_SEATS_POSITIVE),
  }),
});

const updateEventSchema = z.object({
  body: z.object({
    title: z.string().min(3).optional(),
    description: z.string().min(10).optional(),
    venue: z.string().min(3).optional(),
    eventDate: z.string().datetime().optional(),
    totalSeats: z.number().int().positive().optional(),
  }),
  params: z.object({
    id: z.string().regex(/^\d+$/, VALIDATION_MESSAGES.ID_INTEGER),
  }),
});

const getEventParamsSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, VALIDATION_MESSAGES.ID_INTEGER),
  }),
});

module.exports = {
  createEventSchema,
  updateEventSchema,
  getEventParamsSchema,
};
