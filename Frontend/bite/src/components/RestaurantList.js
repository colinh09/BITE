// RestaurantList.js
import React from 'react';

const RestaurantList = ({ title, restaurants }) => {
  return (
    <div>
      <h2>{title}</h2>
      <ul>
        {restaurants.map((restaurant) => (
          <li key={restaurant._id}>{restaurant.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default RestaurantList;
