const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: {
    type: String
  },
  description: {
    type: String
  },
  images: {
    type: String,
    default: "https://unsplash.com/photos/GmlMtdSfmVU", // default if undefined
    set: v => (v && v.trim() !== "" ? v : "https://unsplash.com/photos/GmlMtdSfmVU") // fallback if empty
  },
  price: {
    type: Number
  },
  location: {
    type: String
  },
  country: {
    type: String
  }
});

const Listing = mongoose.model('Listing', listingSchema);
module.exports = Listing;