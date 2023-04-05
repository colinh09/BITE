const mongoose = require('mongoose');

const RatingSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  restaurant_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true,
  },
  review_content: {
    type: String,
    required: true,
  },
  star_rating: {
    type: Number,
    required: true,
  },
  price_level: {
    type: Number,
    required: true,
  },
  repeat_visit: {
    type: Boolean,
    required: true,
  },
  public_review: {
    type: Boolean,
    required: true,
  },
});

const Rating = mongoose.model('Rating', RatingSchema, 'ratings');

module.exports = Rating;
