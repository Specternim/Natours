const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, `A tour must have a name.`],
    unique: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  description: {
    type: String,
    trim: true,
  },
  difficulty: {
    type: String,
    required: [true, `A tour must have a difficulty level.`],
  },
  duration: {
    type: Number,
    required: [true, `A tour must have a duration.`],
  },
  imageCover: {
    type: String,
    required: [true, `A tour must have a cover image.`],
  },
  images: [String],
  maxGroupSize: {
    type: Number,
    required: [true, `A tour must have a group size.`],
  },
  price: {
    type: Number,
    required: [true, `A tour must have a price.`],
  },
  priceDiscount: Number,
  ratingsQuantity: {
    type: Number,
    default: 0,
  },
  ratingsAverage: {
    type: Number,
    default: 4.5,
  },
  summary: {
    type: String,
    trim: true, // will remove white space in the content.
    required: [true, `A tour must have a description.`],
  },
  startDates: [Date],
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
