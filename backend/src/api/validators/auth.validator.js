const { z } = require('zod');
const { VALIDATION_MESSAGES } = require('../../shared/constants');

const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2, VALIDATION_MESSAGES.NAME_MIN_LENGTH),
    email: z.string().email(VALIDATION_MESSAGES.INVALID_EMAIL),
    password: z.string().min(6, VALIDATION_MESSAGES.PASSWORD_MIN_LENGTH),
    role: z.enum(['CUSTOMER', 'ORGANIZER']).optional(),
  }),
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().email(VALIDATION_MESSAGES.INVALID_EMAIL),
    password: z.string().min(1, VALIDATION_MESSAGES.PASSWORD_REQUIRED),
  }),
});

module.exports = {
  registerSchema,
  loginSchema,
};
