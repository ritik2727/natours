const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');
const userModel = require('./userModel');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must Have a name'],
      unique: true,
      trim: true,
      maxlength: [40, 'A tour must have less or equal then 40 characters'],
      minlength: [10, 'A tour must have less or equal than 10 characters'],
      // validate:[validator.isAlpha,'Tour name only contain characters']
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a max group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty either :easy,medium,difficult',
      },
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1'],
      max: [5, 'Rating must be below 5'],
    },
    ratingQuantity: {
      type: Number,
      default: 0,
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (value) {
          // this only points to current doc on NEW documents creation
          return value < this.price; //100 < 200
        },
        message: 'Discount price ({VALUE}) should be below regular price',
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a summary'],
      // trim only work in string it remove white spaces
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      require: [true, 'A tour must have a cover image'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
    startLocations: {
      // GeoJSON
      // embedded object
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

// we can use this in query
tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

// DOCUMENT MIDDLEWARE : RUNS BEFORE .SAVE() AND .CREATE()
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// tourSchema.post('save', function (doc, next) {
//   console.log(doc);
//   next();
// });

//  QUERY MIDDLEWARE : RUNS BEFORE OR AFTER QUERY
tourSchema.pre(/^find/, function (next) {
  // tourSchema.pre('find',function(next){
  this.find({ secretTour: { $ne: true } });

  this.start = Date.now();
  next();
});
tourSchema.pre(/^find/, function ( next) {
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt',
    // Check for any additional options here
  });
  next();
});

tourSchema.post(/^find/, function (docs, next) {
  console.log(`query took ${Date.now() - this.start} milliseconds`);
  next();
});

// AGGREGATE MIDDLEWARE : RUNS AFTER OR AFTER AGGREGATE FUNCTION
tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  // console.log(this._pipeline);
  next();
});

const TourModel = mongoose.model('Tour', tourSchema);

module.exports = TourModel;
