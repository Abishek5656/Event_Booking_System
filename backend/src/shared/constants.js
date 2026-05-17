const ERROR_MESSAGES = {
  FORBIDDEN: 'You do not have permission to perform this action',
  UNAUTHORIZED: 'You are not logged in! Please log in to get access.',
  TOKEN_INVALID: 'Invalid or expired token',
  USER_NOT_FOUND: 'The user belonging to this token no longer exists.',
};

const VALIDATION_MESSAGES = {
  // Auth
  NAME_MIN_LENGTH: 'Name must be at least 2 characters',
  INVALID_EMAIL: 'Invalid email address',
  PASSWORD_MIN_LENGTH: 'Password must be at least 6 characters',
  PASSWORD_REQUIRED: 'Password is required',
  // Booking
  EVENT_ID_POSITIVE: 'eventId must be a positive integer',
  TICKETS_COUNT_MIN: 'ticketsCount must be at least 1',
  // Event
  TITLE_MIN_LENGTH: 'Title must be at least 3 characters',
  DESCRIPTION_MIN_LENGTH: 'Description must be at least 10 characters',
  VENUE_MIN_LENGTH: 'Venue must be at least 3 characters',
  INVALID_DATETIME: 'Must be a valid ISO datetime string',
  TOTAL_SEATS_POSITIVE: 'Total seats must be a positive integer',
  ID_INTEGER: 'ID must be an integer',
};

module.exports = {
  ERROR_MESSAGES,
  VALIDATION_MESSAGES,
};
