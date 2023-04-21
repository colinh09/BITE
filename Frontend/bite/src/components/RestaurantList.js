import React from 'react';

const RestaurantList = ({ title, restaurants }) => {
  const renderRestaurants = () => {
    if (Array.isArray(restaurants)) {
      return restaurants.map((restaurant) => (
        <li key={restaurant._id}>{restaurant.name}</li>
      ));
    }
    return <p>No restaurants found.</p>;
  };

  return (
    <div>
      <h2>{title}</h2>
      <ul>{renderRestaurants()}</ul>
    </div>
  );
};

export default RestaurantList;
