const Listing = require('./models/listing');
const Review = require('./models/review');



module.exports.isLoggedIn = (req, res, next) => { 
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
    next();
}

module.exports.saveRedirectUrl = async (req, res, next) => {
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async (req, res, next) => {
    const {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.isReviewAuthor = async (req, res, next) => {
    const {id,reviewId} = req.params;
    const review = await Review.findById(reviewId);      
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/listings/${id}`);
    }    
    next();
}