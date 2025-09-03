const express = require('express');
const router = express.Router();
const Listing = require('../models/listing.js');
const wrapAsync = require("../utils/wrapAsync.js");
const {listingSchema} = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const { isLoggedIn } = require('../middleware.js');
const { isOwner } = require('../middleware.js');
const listingController = require('../controllers/listings.js');

// const validateListing = (req,res,next)=>{
//     let {error} = listingSchema.validate(req.body);
//     if(error)
//     {
//         let errorMsg = error.details.map((el) => el.message).join(",");
//         throw new ExpressError(400,errorMsg);
//     }else{
//         next();
//     }
// }


//Index Route
router.get(
    '/',  
    wrapAsync(listingController.index)
);

//New Route
router.get('/new',isLoggedIn,
    listingController.renderNewForm
);
//show route
router.get(
    '/:id', 
    wrapAsync(listingController.showListing)
);

//Create Route
router.post(
    '/',
    isLoggedIn,
    wrapAsync(listingController.createListing)
);

// Edit Route   
router.get(
    '/:id/edit',
    isLoggedIn,
        isOwner,
     wrapAsync(listingController.renderEditForm)
);

// Update Route
router.put(
    '/:id',
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.updateListing)
);

// Delete Route
router.delete(
    '/:id',
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.deleteListing)
);

module.exports = router;