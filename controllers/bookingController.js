const catchAsync = require('./../utils/catchAsync');
const TourModel = require('./../models/tourModel');
const BookingModel = require('./../models/bookingModel');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const AppError = require('../utils/appError');

exports.getCheckoutSession = async (req, res, next) => {
  // 1) get the currently booked tour
  const tour = await TourModel.findById(req.params.tourID);

  // 2) create checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    // ui_mode: 'embedded',
    mode: 'payment', // Specify the mode here
    success_url: `${req.protocol}://${req.get('host')}/?tour=${
      req.params.tourID
    }&user=${req.user.id}&price=${tour.price}`,
    cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.tourID,
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: `${tour.name} Tour`,
            description: tour.summary,
            images: [`https://www.natours.dev/img/tours/${tour.imageCover}`],
          },
          unit_amount: tour.price * 100,
        },
        quantity: 1,
      },
    ],
  });

  // ) create session as response
  // Corrected response code
  res.status(200).json({
    status: 'success',
    session,
  });
};
exports.createBookingCheckout = async (req, res, next) => {
  // This soln is tempery ,coz everyone can book
  const { tour, user, price } = req.query;
  if (!tour && !user && !price) {
    next();
  }

  await BookingModel.create({ tour, user, price });

  res.redirect(req.originalUrl.split('?')[0]);

  next();
};
