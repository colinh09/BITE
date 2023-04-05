const express = require('express');
const router = express.Router();
const Rating = require('../models/Rating');

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