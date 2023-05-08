import React, { useState, useEffect } from 'react';
import { AiOutlineSetting } from 'react-icons/ai'; // Make sure to install react-icons
import './TasteProfile.css';
import ProfileSettings from '../components/ProfileSettings';

function TasteProfile() {
  const [user, setUser] = useState(null);
  const [showSettings, setShowSettings] = useState(false);

  const apiUrl = process.env.REACT_APP_PUBLIC_URL || 'http://localhost:5000/';

  useEffect(() => {
    const fetchData = async () => {
      const userId = localStorage.getItem('userId');
      const idToken = localStorage.getItem('idToken');

      const response = await fetch(apiUrl + `api/users/${userId}`, {
        headers: { 'Authorization': `Bearer ${idToken}` },
      });

      const data = await response.json();
      setUser(data);
    };
    fetchData();
  }, []);

  if (!user) return <div>Loading Page...</div>;

  return (
    <div className="taste-profile">
      <div className="profile-container">
        <div className="profile-info">
            <h1 className="welcome-message">Hello {user.username}.</h1>
            <p className="welcome-subtitle">Below are your taste profile and stats!</p>
            <p><span className="key">Dietary Restrictions:</span> {user.dietaryRestrictions ? user.dietaryRestrictions.join(', ') : 'None'}</p>
            <p><span className="key">City:</span> {user.city}</p>
            <p><span className="key">State:</span> {user.state}</p>
            <p><span className="key">Number of Friends:</span> {user.friends.length}</p>
            <p><span className="key">Number of Restaurants Visited:</span> {user.haveBeenTo.length}</p>
        </div>
        <div className="profile-settings">
            <h1 className="welcome-message">Changed your mind about something?</h1>
            <p className="welcome-subtitle">Edit it here:</p>
            <ProfileSettings userId={user._id} idToken={localStorage.getItem('idToken')} />
        </div>
      </div>
    </div>
  );
}

export default TasteProfile;
