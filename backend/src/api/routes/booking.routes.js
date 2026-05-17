const express = require('express');
const bookingController = require('../controllers/booking.controller');
const { protect, restrictTo } = require('../middlewares/auth.middleware');
const { validateRequest } = require('../middlewares/validate.middleware');
const { createBookingSchema } = require('../validators/booking.validator');

const router = express.Router();

// Only customers can access booking routes
router.use(protect);
router.use(restrictTo('CUSTOMER'));

router.post('/', validateRequest(createBookingSchema), bookingController.createBooking);
router.get('/my-bookings', bookingController.getMyBookings);

module.exports = router;
