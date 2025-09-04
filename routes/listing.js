const express = require('express');
const router = express.Router();
const Listing = require('../models/listing.js');
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn } = require('../middleware.js');
const { isOwner } = require('../middleware.js');
const listingController = require('../controllers/listings.js');
const multer  = require('multer');
const { storage } = require('../cloudConfig.js');
const upload = multer({ storage });

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

router
.route("/")
.get(wrapAsync(listingController.index))
.post(
    isLoggedIn,
    upload.single('listing[image]'),
    wrapAsync(listingController.createListing)
);


router.get('/new',isLoggedIn,
    listingController.renderNewForm
);

router.
route('/:id')
.get(
     wrapAsync(listingController.showListing)
)
.put(
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.updateListing)
)
.delete(
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.deleteListing)
);



//New Route


// Edit Route   
router.get(
    '/:id/edit',
    isLoggedIn,
        isOwner,
     wrapAsync(listingController.renderEditForm)
);



module.exports = router;