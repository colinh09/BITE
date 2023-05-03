import React, { useState, useEffect } from 'react';
import './TasteProfile.css';

function TasteProfile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const userId = localStorage.getItem('userId');
      const idToken = localStorage.getItem('idToken');

      const response = await fetch(`api/users/${userId}`, {
        headers: { 'Authorization': `Bearer ${idToken}` },
      });

      const data = await response.json();
      setUser(data);
    };
    fetchData();
  }, []);

  if (!user) return <div>User not found...</div>;

  return (
    <div className="taste-profile">
      <h1>{user.username}</h1>
      <p>Dietary Restrictions: {user.dietaryRestrictions.join(', ') || 'None'}</p>
      <p>City: {user.city}</p>
      <p>State: {user.state}</p>
      <p>Number of Friends: {user.friends.length}</p>
      <p>Number of Restaurants Visited: {user.haveBeenTo.length}</p>
      {/* Add the settings popup component here */}
    </div>
  );
}

export default TasteProfile;
