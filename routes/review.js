const express = require('express');
const router = express.Router({ mergeParams: true });
const Listing = require('../models/listing.js');
const wrapAsync = require("../utils/wrapAsync.js");
const { reviewSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require('../models/review.js');  

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const errorMsg = error.details.map(el => el.message).join(',');
        throw new ExpressError(errorMsg, 400);
    } else {
        next();
    }
};

//Review Routes
router.post(
    '/', validateReview,
    wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash('success', 'Created new review!');
    res.redirect(`/listings/${id}`);
}));

//Delete Review Route
router.delete(
    '/:reviewId',
    wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review');
    res.redirect(`/listings/${id}`);
}));

module.exports = router;