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
  wantsToTry: [
    {
      restaurant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant',
      },
      timestamp: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  haveBeenTo: [
    {
      restaurant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant',
      },
      timestamp: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  favorites: [
    {
      restaurant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant',
      },
      timestamp: {
        type: Date,
        default: Date.now,
      },
    },
  ],
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