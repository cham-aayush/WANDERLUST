const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Listing = require('./models/listing.js');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema} = require("./schema.js");

const MONGO_URL = 'mongodb://localhost:27017/wanderlust';

main().then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Error connecting to MongoDB:', err);
}); 


async function main() {
    await mongoose.connect(MONGO_URL);
}
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.engine("ejs", ejsMate);

app.get('/',(req,res)=>{
    res.send('Hi I am root');
});


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


app.get('/listings', wrapAsync(async (req, res) => {
   const allListings = await Listing.find({});
        res.render('listings/index.ejs', {  allListings });
}));

//New Route
app.get('/listings/new', wrapAsync((req, res) => {
    res.render('listings/new.ejs');
}));
//show route
app.get('/listings/:id', wrapAsync(async (req, res) => {
    let {id} = req.params;
   const listing =  await Listing.findById(id);
   res.render('listings/show.ejs', { listing });
}));

//Create Route
app.post('/listings', validateListing, wrapAsync(async (req, res) => {
   const newListing =  new Listing(req.body.listing);
   await newListing.save();
    res.redirect(`/listings`);
}));

// Edit Route   
app.get('/listings/:id/edit', wrapAsync(async (req, res) => {
    let {id} = req.params;
   const listing =  await Listing.findById(id);
   res.render('listings/edit.ejs', { listing });
}));

// Update Route
app.put('/listings/:id', validateListing ,wrapAsync(async (req, res) => {
    if (!req.body.listing) throw new ExpressError('Invalid Listing Data', 400);
    // Ensure that the listing data is valid before proceeding
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,{ ...req.body.listing});
   res.redirect(`/listings/${id}`);
}));

// Delete Route
app.delete('/listings/:id', wrapAsync(async (req, res) => {   
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
   res.redirect('/listings');
}));

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
});


app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something went wrong" } = err;
    //res.status(statusCode).send(message);
    res.render("error.ejs", { error: err });
});


app.listen(8080, () => {
  console.log('Server is running on port 8080');
});
