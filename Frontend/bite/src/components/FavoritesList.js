import React, { useState, useEffect } from 'react';

const FavoritesList = ({ userId, idToken }) => {
  const [favoritesList, setFavoritesList] = useState([]);

  useEffect(() => {
    fetchFavoritesList(userId, idToken);
  }, [userId, idToken]);

  const apiUrl = process.env.REACT_APP_PUBLIC_URL || 'http://localhost:5000/';

  const fetchFavoritesList = async (userId, idToken) => {
    try {
      const response = await fetch(apiUrl + `/api/users/${userId}/favorites`, {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });
      const favorites = await response.json();
      setFavoritesList(favorites);
    } catch (error) {
      console.error('Error fetching favorites list:', error);
    }
  };

  return (
    <div>
      <h2>Favorites</h2>
      <ul>
        {favoritesList.map((item) => (
          <li key={item._id}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default FavoritesList;
