const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/apiFeatures');
const createAsync = require('../utils/catchAsync');

exports.aliasTopTours = (req, _, next) => {
  req.query.limit = '5';
  req.query.sort = 'price,-ratingsAverage';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

exports.createTour = createAsync(async (req, res, next) => {
  const newTour = await Tour.create(req.body);

  res.status(200).json({
    status: 'success',
    data: { newTour },
  });
});

exports.getAllTours = createAsync(async (req, res, next) => {
  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const tours = await features.query;

  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: { tours },
  });
});

exports.getTour = createAsync(async (req, res, next) => {
  const getTour = await Tour.findById(req.params.id);

  res.status(200).json({
    status: 'success',
    data: { getTour },
  });
});

exports.updateTour = createAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(202).json({
    status: 'success',
    data: { tour },
  });
});

exports.deleteTour = createAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndDelete(req.params.id);

  res.status(204).json({
    status: 'success',
    data: { tour },
  });
});

exports.getTourStats = createAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: { avgPrice: 1 },
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: { stats },
  });
});

exports.getMonthlyPlan = createAsync(async (req, res, next) => {
  const year = req.params.year * 1;

  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numToursStart: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    {
      $addFields: { month: '$_id' },
    },
    {
      $project: { _id: 0 },
    },
    {
      $sort: { numToursStart: -1 },
    },
  ]);

  res.status(200).json({
    message: 'success',
    data: { plan },
  });
});
