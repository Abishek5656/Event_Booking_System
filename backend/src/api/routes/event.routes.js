const express = require('express');
const eventController = require('../controllers/event.controller');
const { protect, restrictTo } = require('../middlewares/auth.middleware');
const { validateRequest } = require('../middlewares/validate.middleware');
const {
  createEventSchema,
  updateEventSchema,
  getEventParamsSchema,
} = require('../validators/event.validator');

const router = express.Router();

// Public Routes
router.get('/', eventController.getAllEvents);
router.get('/:id', validateRequest(getEventParamsSchema), eventController.getEventById);

// Protected Organizer Routes
router.use(protect);
router.use(restrictTo('ORGANIZER'));

router.post('/', validateRequest(createEventSchema), eventController.createEvent);
router.put('/:id', validateRequest(updateEventSchema), eventController.updateEvent);

module.exports = router;
