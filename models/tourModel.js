const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, `A tour must have a name.`],
      unique: true,
      trim: true,
      maxlength: [40, `A tour must have less than or equal to 40 characters.`],
      minlength: [10, `A tour must have more than 10 characters.`],
      validate: {
        validator: function (val) {
          return validator.isAlpha(val, 'en-US', { ignore: ' ' });
          /* validator.isAlpha(
            <value to be evaluated>, 
            [defaults to 'en-US' if not mentioned], 
            {object where you can specify what to ignore.}
            )
            NOTE: Check docs here for clarification.
            https://www.npmjs.com/package/validator
          */
        },
        message: `Tour's name must only contain characters.`,
      },
    },
    slug: String,
    difficulty: {
      type: String,
      required: [true, `A tour must have a difficulty level.`],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: `Difficulty is either: easy, medium or difficult.`,
      },
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
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          return val < this.price;
        },
        message: `Discount price ({VALUE}) should be below regular price.`,
      },
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, `The rating should be minimum 1.0.`],
      max: [5, `The rating should be below 5.0.`],
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
  next();
});

// AGGREGATION MIDDLEWARE
tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
