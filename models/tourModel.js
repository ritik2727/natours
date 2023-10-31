const mongoose = require('mongoose');
const slugify = require('slugify');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: [true, 'A tour must Have a name'],
      unique: true,
      trim: true,
    },
    slug: String,
    duration: {
      type: Number,
      require: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      require: [true, 'A tour must have a max group size'],
    },
    difficulty: {
      type: String,
      require: [true, 'A tour must have a difficulty'],
    },
    price: {
      type: Number,
      require: [true, 'A tour must have a price'],
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
    },
    ratingQuantity: {
      type: Number,
      default: 0,
    },
    priceDiscount: Number,
    summary: {
      type: String,
      trim: true,
      require: [true, 'A tour must have a summary'],
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
// tourSchema.pre('findOne',function(next){
//   this.find({secretTour:{$ne:true}})
//   next();
// })

tourSchema.post(/^find/,function(docs,next) {
  console.log(`query took ${Date.now() - this.start} milliseconds`);
  next();
})

const TourModel = mongoose.model('Tour', tourSchema);

module.exports = TourModel;
