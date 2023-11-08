const reviewModel = require("../models/reviewModel");
const catchAsync = require("../utils/catchAsync");

exports.getAllReviews = catchAsync(async (req,res)=>{
    const reviews = await reviewModel.find();

    res.status(200).json({
        status:'success',
        result:reviews.length,
        data:{
            reviews
        }
    })
})

exports.createReview = catchAsync(async (req,res)=>{
    const newReview = await reviewModel.create(req.body);

    res.status(201).json({
        status:'success',
        data:{
            review:newReview
        }
    })
})