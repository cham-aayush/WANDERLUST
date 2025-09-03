const express = require('express');
const router = express.Router({ mergeParams: true });
const Listing = require('../models/listing.js');
const wrapAsync = require("../utils/wrapAsync.js");
const { reviewSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require('../models/review.js');  
const { isLoggedIn,isReviewAuthor } = require('../middleware.js');
const reviewController = require('../controllers/reviews.js');


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
    isLoggedIn,
    wrapAsync(reviewController.createReview));

//Delete Review Route
router.delete(
    '/:reviewId',
    isLoggedIn,
    isReviewAuthor,
    wrapAsync(reviewController.deleteReview));

module.exports = router;