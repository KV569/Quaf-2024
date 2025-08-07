const Subscriber = require('../models/Subscriber');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/async');
const sendEmail = require('../utils/emailSender');

// @desc    Subscribe to newsletter
// @route   POST /api/v1/newsletter/subscribe
// @access  Public
exports.subscribe = asyncHandler(async (req, res, next) => {
  const { email, name, institution } = req.body;

  // Check if already subscribed
  const existingSubscriber = await Subscriber.findOne({ email });

  if (existingSubscriber) {
    return next(new ErrorResponse('Email is already subscribed', 400));
  }

  const subscriber = await Subscriber.create({
    email,
    name,
    institution
  });

  // Send welcome email
  const message = `Thank you for subscribing to Quaf Publications newsletter! You'll now receive updates on our latest articles and publications.`;

  try {
    await sendEmail({
      email: subscriber.email,
      subject: 'Welcome to Quaf Publications',
      message
    });

    res.status(201).json({
      success: true,
      data: subscriber
    });
  } catch (err) {
    console.log(err);
    await Subscriber.findByIdAndDelete(subscriber._id);
    return next(new ErrorResponse('Email could not be sent', 500));
  }
});

// @desc    Unsubscribe from newsletter
// @route   DELETE /api/v1/newsletter/unsubscribe/:email
// @access  Public
exports.unsubscribe = asyncHandler(async (req, res, next) => {
  const subscriber = await Subscriber.findOneAndDelete({ email: req.params.email });

  if (!subscriber) {
    return next(new ErrorResponse('Email not found in our subscription list', 404));
  }

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Get all subscribers
// @route   GET /api/v1/newsletter/subscribers
// @access  Private/Admin
exports.getSubscribers = asyncHandler(async (req, res, next) => {
  const subscribers = await Subscriber.find();

  res.status(200).json({
    success: true,
    count: subscribers.length,
    data: subscribers
  });
});

// @desc    Send newsletter to all subscribers
// @route   POST /api/v1/newsletter/send
// @access  Private/Admin
exports.sendNewsletter = asyncHandler(async (req, res, next) => {
  const { subject, message } = req.body;

  const subscribers = await Subscriber.find({ active: true });

  if (subscribers.length === 0) {
    return next(new ErrorResponse('No active subscribers found', 404));
  }

  // Send email to each subscriber
  const sendEmails = subscribers.map(subscriber => {
    return sendEmail({
      email: subscriber.email,
      subject,
      message
    });
  });

  await Promise.all(sendEmails);

  res.status(200).json({
    success: true,
    data: 'Newsletter sent successfully'
  });
});