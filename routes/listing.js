const express = require('express');
const router = express.Router();
const Listing = require('../models/listing.js');
const wrapAsync = require("../utils/wrapAsync.js");
const {listingSchema} = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");


const validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error)
    {
        let errorMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400,reult.error);
    }else{
        next();
    }
}


//Index Route
router.get(
    '/', 
    wrapAsync(async (req, res) => {
   const allListings = await Listing.find({});
        res.render('listings/index.ejs', {  allListings });
}));

//New Route
router.get(
    '/new',
     wrapAsync((req, res) => {
    res.render('listings/new.ejs');
}));
//show route
router.get(
    '/:id', 
    wrapAsync(async (req, res) => {
    let {id} = req.params;
   const listing =  await Listing.findById(id).populate('reviews');
   res.render('listings/show.ejs', { listing });
}));

//Create Route
router.post(
    '/', 
    validateListing, 
    wrapAsync(async (req, res) => {
   const newListing =  new Listing(req.body.listing);
   await newListing.save();
    res.redirect(`/listings`);
}));

// Edit Route   
router.get(
    '/:id/edit',
     wrapAsync(async (req, res) => {
    let {id} = req.params;
   const listing =  await Listing.findById(id);
   res.render('listings/edit.ejs', { listing });
}));

// Update Route
router.put(
    '/:id', 
    validateListing ,
    wrapAsync(async (req, res) => {
    if (!req.body.listing) throw new ExpressError('Invalid Listing Data', 400);
    // Ensure that the listing data is valid before proceeding
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,{ ...req.body.listing});
   res.redirect(`/listings/${id}`);
}));

// Delete Route
router.delete(
    '/:id',
     wrapAsync(async (req, res) => {   
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
   res.redirect('/listings');
}));

module.exports = router;