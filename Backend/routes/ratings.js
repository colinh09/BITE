const express = require('express');
const router = express.Router();
const Rating = require('../models/Rating');
const User = require('../models/User');
const mongoose = require('mongoose');
const authenticate = require('../authMiddleware.js');

router.use(authenticate);

router.get('/search-ratings', async (req, res) => {
  const { publicOnly, privateOnly, userId } = req.query;

  try {
    let query = {};

    if (publicOnly === 'true' && privateOnly === 'true') {
      const user = await User.findById(userId);
      const friendIds = user.friends.map(friend => new mongoose.Types.ObjectId(friend));
      query = {
        $or: [
          { public_review: true },
          {
            $and: [
              { public_review: false },
              { user_id: { $in: friendIds } },
            ],
          },
        ],
      };
    } else if (publicOnly === 'true') {
      query.public_review = true;
    } else if (privateOnly === 'true') {
      const user = await User.findById(userId);
      const friendIds = user.friends.map(friend => new mongoose.Types.ObjectId(friend));
      query = {
        $and: [
          { public_review: false },
          { user_id: { $in: friendIds } },
        ],
      };
    }

    const ratings = await Rating.find(query);
    res.json(ratings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



// GET all ratings
router.get('/', async (req, res) => {
  try {
    const ratings = await Rating.find();
    res.json(ratings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new rating
router.post('/', async (req, res) => {
  const newRating = new Rating(req.body);

  try {
    const savedRating = await newRating.save();
    res.status(201).json(savedRating);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET a specific rating
router.get('/:id', getRatingById, (req, res) => {
  res.json(res.rating);
});

// UPDATE a rating
router.patch('/:id', getRatingById, async (req, res) => {
  Object.assign(res.rating, req.body);

  try {
    const updatedRating = await res.rating.save();
    res.json(updatedRating);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a rating
router.delete('/:id', getRatingById, async (req, res) => {
  try {
    await res.rating.remove();
    res.json({ message: 'Rating deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/restaurant/:id/reviews', async (req, res) => {
  const { id } = req.params;

  try {
    const reviews = await Rating.find({ restaurant_id: id });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function getRatingById(req, res, next) {
  let rating;
  try {
    rating = await Rating.findById(req.params.id);
    if (!rating) {
      return res.status(404).json({ message: 'Rating not found' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.rating = rating;
  next();
}

module.exports = router;
