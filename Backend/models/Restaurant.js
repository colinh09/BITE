const mongoose = require('mongoose');

const RestaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  average_price_rating: {
    type: Number,
  },
  average_user_rating: {
    type: Number,
  },
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
});

const Restaurant = mongoose.model('Restaurant', RestaurantSchema, 'restaurants');

module.exports = Restaurant;
