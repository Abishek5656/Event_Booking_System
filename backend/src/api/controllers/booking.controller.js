const bookingService = require('../../services/booking.service');

const catchAsync = (fn) => (req, res, next) => {
  fn(req, res, next).catch(next);
};

class BookingController {
  createBooking = catchAsync(async (req, res) => {
    const { eventId, ticketsCount } = req.body;
    const booking = await bookingService.createBooking(req.user.id, eventId, ticketsCount);
    res.status(201).json({ status: 'success', data: { booking } });
  });

  getMyBookings = catchAsync(async (req, res) => {
    const bookings = await bookingService.getMyBookings(req.user.id);
    res.status(200).json({ status: 'success', results: bookings.length, data: { bookings } });
  });
}

module.exports = new BookingController();
