const eventService = require('../../services/event.service');

const catchAsync = (fn) => (req, res, next) => {
  fn(req, res, next).catch(next);
};

class EventController {
  createEvent = catchAsync(async (req, res) => {
    const event = await eventService.createEvent(req.body, req.user.id);
    res.status(201).json({ status: 'success', data: { event } });
  });

  getAllEvents = catchAsync(async (req, res) => {
    const events = await eventService.getAllEvents();
    res.status(200).json({ status: 'success', results: events.length, data: { events } });
  });

  getEventById = catchAsync(async (req, res) => {
    const event = await eventService.getEventById(req.params.id);
    res.status(200).json({ status: 'success', data: { event } });
  });

  updateEvent = catchAsync(async (req, res) => {
    const event = await eventService.updateEvent(req.params.id, req.body, req.user.id);
    res.status(200).json({ status: 'success', data: { event } });
  });
}

module.exports = new EventController();
