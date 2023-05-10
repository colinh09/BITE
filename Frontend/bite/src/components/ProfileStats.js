import React from 'react';
import "../pages/RegisterPage.css"

function ProfileStats({ user }) {
  return (
    <div className="profile-info">
      <p><span className="key">Number of Friends:</span> {user.friends.length}</p>
      <p><span className="key">Number of Restaurants Visited:</span> {user.haveBeenTo.length}</p>
    </div>
  );
}

export default ProfileStats;