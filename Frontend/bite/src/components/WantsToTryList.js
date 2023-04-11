import React, { useState, useEffect } from 'react';
import RestaurantList from './RestaurantList';

const WantsToTryList = ({ userId }) => {
  const [wantsToTry, setWantsToTry] = useState([]);

  useEffect(() => {
    const fetchWantsToTry = async () => {
      const response = await fetch(`/api/users/${userId}/wants-to-try`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('idToken')}` },
      });
      const data = await response.json();
      setWantsToTry(data);
    };

    fetchWantsToTry();
  }, [userId]);

  return <RestaurantList title="Wants to try" restaurants={wantsToTry} />;
};

export default WantsToTryList;