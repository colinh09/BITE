const express = require('express');
const router = express.Router();
const Restaurant = require('../models/Restaurant');
const authenticate = require('../authMiddleware.js'); 

router.use(authenticate);

router.get('/search', async (req, res) => {
  const searchTerm = req.query.q || '';
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const regex = new RegExp(searchTerm, 'i');

  try {
    const filteredRestaurants = await Restaurant.find({ name: regex })
      .skip((page - 1) * limit)
      .limit(limit);
    const totalFilteredRestaurants = await Restaurant.countDocuments({ name: regex });
    res.json({
      totalPages: Math.ceil(totalFilteredRestaurants / limit),
      currentPage: page,
      limit: limit,
      data: filteredRestaurants,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// GET restaurants by star and price ratings
router.get('/search-restaurants', async (req, res) => {
  console.log(req.query);
  const { minStar, maxStar, minPrice, maxPrice } = req.query;
  console.log(`minStar: ${minStar}, maxStar: ${maxStar}, minPrice: ${minPrice}, maxPrice: ${maxPrice}`);
  try {
    const query = {
      average_user_rating: { $gte: parseFloat(minStar), $lte: parseFloat(maxStar) },
      average_price_rating: { $gte: parseFloat(minPrice), $lte: parseFloat(maxPrice) },
    };

    const restaurants = await Restaurant.find(query);
    res.json(restaurants);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

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