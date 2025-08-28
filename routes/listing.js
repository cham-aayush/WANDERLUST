const express = require('express');
const router = express.Router();
const Listing = require('../models/listing.js');
const wrapAsync = require("../utils/wrapAsync.js");
const {listingSchema} = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const { isLoggedIn } = require('../middleware.js');

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
    wrapAsync(async (req, res) => {
   const allListings = await Listing.find({});
        res.render('listings/index.ejs', {  allListings });
}));

//New Route
router.get('/new',isLoggedIn,(req, res) => {
    res.render('listings/new.ejs');
});
//show route
router.get(
    '/:id', 
    wrapAsync(async (req, res) => {
    let {id} = req.params;
   const listing =  await Listing.findById(id).populate('reviews');
   if(!listing){
    req.flash('error', 'Cannot find that listing!');
    return res.redirect('/listings');
   }
   res.render('listings/show.ejs', { listing });
}));

//Create Route
router.post(
    '/',
    isLoggedIn,
    wrapAsync(async (req, res) => {
   const newListing =  new Listing(req.body.listing);
   await newListing.save();
   req.flash('success', 'Successfully made a new listing!');
    res.redirect(`/listings`);
}));

// Edit Route   
router.get(
    '/:id/edit',
    isLoggedIn,
     wrapAsync(async (req, res) => {
    let {id} = req.params;
   const listing =  await Listing.findById(id);
    if(!listing){
     req.flash('error', 'Cannot find that listing!');
     return res.redirect('/listings');
    }
   res.render('listings/edit.ejs', { listing });
}));

// Update Route
router.put(
    '/:id',
    isLoggedIn,
    wrapAsync(async (req, res) => {
    if (!req.body.listing) throw new ExpressError('Invalid Listing Data', 400);
    // Ensure that the listing data is valid before proceeding
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,{ ...req.body.listing});
    req.flash('success', 'Successfully updated listing!');
   res.redirect(`/listings/${id}`);
}));

// Delete Route
router.delete(
    '/:id',
    isLoggedIn,
     wrapAsync(async (req, res) => {   
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted listing')
   res.redirect('/listings');
}));

module.exports = router;