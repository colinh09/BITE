const express = require('express');
const router = express.Router();
const Restaurant = require('../models/Restaurant');

// GET all restaurants
router.get('/', async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    res.json(restaurants);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new restaurant
router.post('/', async (req, res) => {
  const newRestaurant = new Restaurant(req.body);

  try {
    const savedRestaurant = await newRestaurant.save();
    res.status(201).json(savedRestaurant);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET a specific restaurant
router.get('/:id', getRestaurantById, (req, res) => {
  res.json(res.restaurant);
});

// UPDATE a restaurant
router.patch('/:id', getRestaurantById, async (req, res) => {
  Object.assign(res.restaurant, req.body);

  try {
    const updatedRestaurant = await res.restaurant.save();
    res.json(updatedRestaurant);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a restaurant
router.delete('/:id', getRestaurantById, async (req, res) => {
  try {
    await res.restaurant.remove();
    res.json({ message: 'Restaurant deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function getRestaurantById(req, res, next) {
  let restaurant;

  try {
    restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.restaurant = restaurant;
  next();
}

module.exports = router;