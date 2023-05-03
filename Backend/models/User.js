const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  friends: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  wantsToTry: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
  }],
  haveBeenTo: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
  }],
  favorites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
  }],
  dietaryRestrictions: {
    type: [String],
    default: [],
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
});

const User = mongoose.model('User', UserSchema, 'users');

module.exports = User;