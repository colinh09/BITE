const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Rating = require('../models/Rating');
const Restaurant = require('../models/Restaurant');
const authenticate = require('../authMiddleware.js');

router.use(authenticate);

// get all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// add new users
router.post('/', async (req, res) => {
  const newUser = new User(req.body);

  try {
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// get user by user id
router.get('/:id', getUserById, (req, res) => {
  res.json(res.user);
});

// get user by username
router.get('/by-username/:username', getUserByUsername, (req, res) => {
  res.json(res.user);
});

// get user by email
router.get('/by-email/:email', getUserByEmail, (req, res) => {
  res.json(res.user);
});



// update user by user id
router.patch('/:id', getUserById, async (req, res) => {
  Object.assign(res.user, req.body);

  try {
    const updatedUser = await res.user.save();
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// delete by user id. 
// ensures cascading on delete by deleting reviews and user from other friends lists
router.delete('/:id', getUserById, async (req, res) => {
  try {
    // Remove user's reviews
    await Rating.deleteMany({ user_id: res.user._id });

    // Update friends' friends lists
    for (const friendId of res.user.friends) {
      const friend = await User.findById(friendId);
      friend.friends.pull(res.user._id);
      await friend.save();
    }

    // Remove the user
    await res.user.remove();
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// get all ratings by a specific user
router.get('/:id/ratings', getUserById, async (req, res) => {
  try {
    const ratings = await Rating.find({ user_id: res.user._id });
    res.json(ratings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// get user's wantsToTry list
router.get('/:id/wants-to-try', getUserById, async (req, res) => {
  try {
    const wantsToTry = await Restaurant.find({ _id: { $in: res.user.wantsToTry.map(entry => entry._id) } }).sort({ timestamp: -1 });
    res.json(wantsToTry);
    console.log(wantsToTry);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// add a restaurant to wantsToTry
router.put('/:id/wants-to-try/add', getUserById, async (req, res) => {
  const restaurantId = req.body.restaurantId;
  try {
    const existingRestaurant = res.user.wantsToTry.find(r => r.restaurantId === restaurantId);
    if (!existingRestaurant) {
      res.user.wantsToTry.push({ _id: restaurantId, timestamp: new Date() });
      const updatedUser = await res.user.save();
      res.json(updatedUser);
    } else {
      res.status(400).json({ message: 'Restaurant already exists in wantsToTry list' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// delete a restaurant from wantsToTry
router.put('/:id/wants-to-try/delete', getUserById, async (req, res) => {
  const restaurantId = req.body.restaurantId;
  try {
    const restaurantIndex = res.user.wantsToTry.findIndex(entry => entry._id == restaurantId);
    if (restaurantIndex !== -1) {
      res.user.wantsToTry.splice(restaurantIndex, 1);
      const updatedUser = await res.user.save();
      res.json(updatedUser);
    } else {
      res.status(400).json({ message: 'Restaurant not found in wantsToTry list' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// get user's haveBeenTo list
router.get('/:id/have-been-to', getUserById, async (req, res) => {
  try {
    const haveBeenTo = await Restaurant.find({ _id: { $in: res.user.haveBeenTo.map(entry => entry._id) } }).sort({ timestamp: -1 });
    res.json(haveBeenTo);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// add a restaurant to haveBeenTo
router.put('/:id/have-been-to/add', getUserById, async (req, res) => {
  const restaurantId = req.body.restaurantId;
  try {
    const existingRestaurant = res.user.haveBeenTo.find(r => r.restaurantId === restaurantId);
    if (!existingRestaurant) {
      res.user.haveBeenTo.push({ _id: restaurantId, timestamp: new Date() });
      const updatedUser = await res.user.save();
      res.json(updatedUser);
    } else {
      res.status(400).json({ message: 'Restaurant already exists in haveBeenTo list' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// delete a restaurant from haveBeenTo
router.put('/:id/have-been-to/delete', getUserById, async (req, res) => {
  const restaurantId = req.body.restaurantId;
  try {
    const restaurantIndex = res.user.haveBeenTo.findIndex(entry => entry._id == restaurantId);
    if (restaurantIndex !== -1) {
      res.user.haveBeenTo.splice(restaurantIndex, 1);
      const updatedUser = await res.user.save();
      res.json(updatedUser);
    } else {
      res.status(400).json({ message: 'Restaurant not found in haveBeenTo list' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// get user's favorites list
router.get('/:id/favorites', getUserById, async (req, res) => {
  try {
    const favorites = await Restaurant.find({ _id: { $in: res.user.favorites.map(entry => entry._id) } }).sort({ timestamp: -1 });
    res.json(favorites);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// add a restaurant to favorites
router.put('/:id/favorites/add', getUserById, async (req, res) => {
  const restaurantId = req.body.restaurantId;
  try {
    const existingRestaurant = res.user.favorites.find(r => r.restaurantId === restaurantId);
    if (!existingRestaurant) {
      res.user.favorites.push({ _id: restaurantId, timestamp: new Date() });
      const updatedUser = await res.user.save();
      res.json(updatedUser);
    } else {
      res.status(400).json({ message: 'Restaurant already exists in favorites list' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// delete a restaurant from favorites
router.put('/:id/favorites/delete', getUserById, async (req, res) => {
  const restaurantId = req.body.restaurantId;
  try {
    const restaurantIndex = res.user.favorites.findIndex(entry => entry._id == restaurantId);
    if (restaurantIndex !== -1) {
      res.user.favorites.splice(restaurantIndex, 1);
      const updatedUser = await res.user.save();
      res.json(updatedUser);
    } else {
      res.status(400).json({ message: 'Restaurant not found in favorites list' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// view a friend's haveBeenTo, wantToTry, and favorites lists
router.get('/:id/friends/:friendId/lists', getUserById, async (req, res) => {
  const friendId = req.params.friendId;
  if (!res.user.friends.includes(friendId)) {
    return res.status(404).json({ message: 'Friend not found' });
  }
  try {
    const friend = await User.findById(friendId);
    const haveBeenTo = await Restaurant.find({ _id: { $in: friend.haveBeenTo } });
    const wantsToTry = await Restaurant.find({ _id: { $in: friend.wantsToTry } });
    const favorites = await Restaurant.find({ _id: { $in: friend.favorites } });
    res.json({
      haveBeenTo,
      wantsToTry,
      favorites,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// add friend
router.put('/:id/friends/add', getUserById, async (req, res) => {
  const friendId = req.body.friendId;
  try {
    if (!res.user.friends.includes(friendId)) {
      res.user.friends.push(friendId);
      const updatedUser = await res.user.save();

      // Update the friend's friends list
      const friend = await User.findById(friendId);
      friend.friends.push(res.user._id);
      await friend.save();

      res.json(updatedUser);
    } else {
      res.status(400).json({ message: 'Friend already added' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// delete friend
router.put('/:id/friends/delete', getUserById, async (req, res) => {
  const friendId = req.body.friendId;
  try {
    if (res.user.friends.includes(friendId)) {
      res.user.friends.pull(friendId);
      const updatedUser = await res.user.save();

      // Update the friend's friends list
      const friend = await User.findById(friendId);
      friend.friends.pull(res.user._id);
      await friend.save();

      res.json(updatedUser);
    } else {
      res.status(404).json({ message: 'Friend not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// get the number of restaurants the user has been to
router.get('/:id/restaurant-count', getUserById, (req, res) => {
  res.json({
    restaurantCount: res.user.haveBeenTo.length,
  });
});

// get the number of friends the user has
router.get('/:id/friend-count', getUserById, (req, res) => {
  res.json({
    friendCount: res.user.friends.length,
  });
});

// validate password
router.post('/:id/validate-password', getUserById, async (req, res) => {
  const { password } = req.body;
  try {
    if (res.user.password === password) {
      res.json({ isValid: true });
    } else {
      res.json({ isValid: false });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



// Middleware for commonly used queries
async function getUserById(req, res, next) {
  let user;
  try {
    user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.user = user;
  next();
}

async function getUserByUsername(req, res, next) {
  let user;

  try {
    user = await User.findOne({ username: req.params.username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.user = user;
  next();
}

async function getUserByEmail(req, res, next) {
  let user;
  try {
    user = await User.findOne({ email: req.params.email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.user = user;
  next();
}

module.exports = router;
