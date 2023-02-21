const mongoose = require('mongoose');
const slugify = require('slugify');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, `A tour must have a name.`],
      unique: true,
      trim: true,
    },
    slug: String,
    difficulty: {
      type: String,
      required: [true, `A tour must have a difficulty level.`],
    },
    duration: {
      type: Number,
      required: [true, `A tour must have a duration.`],
    },
    price: {
      type: Number,
      required: [true, `A tour must have a price.`],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    description: {
      type: String,
      trim: true,
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
    secretTour: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

// DOCUMENT MIDDLEWARE [MongoDB]: runs before save() & create()
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// QUERY MIDDLEWARE: can be used to define some private tours.
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } }); // exclude showing the tour that has secretTour set to true for all queries starting with find.
  this.start = Date.now();
  next();
});

// AGGREGATION MIDDLEWARE
tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
