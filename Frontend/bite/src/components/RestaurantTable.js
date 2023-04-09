import React from 'react';

const RestaurantTable = ({ restaurants, onDelete }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Location</th>
          <th>Star Rating</th>
          <th>Price Rating</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {restaurants.map((restaurant) => (
          <tr key={restaurant._id}>
            <td>{restaurant.name}</td>
            <td>{restaurant.location}</td>
            <td>{restaurant.average_user_rating}</td>
            <td>{restaurant.average_price_rating}</td>
            <td>
              <button onClick={() => onDelete(restaurant._id)}>X</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default RestaurantTable;