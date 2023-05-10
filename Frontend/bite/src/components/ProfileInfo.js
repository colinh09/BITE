import React from 'react';
import "../pages/RegisterPage.css"

function ProfileInfo({ user }) {
  return (
    <div className="profile-info">
      <p><span className="key">Dietary Restrictions:</span> {user.dietaryRestrictions ? user.dietaryRestrictions.join(', ') : 'None'}</p>
      <p><span className="key">City:</span> {user.city}</p>
      <p><span className="key">State:</span> {user.state}</p>
    </div>
  );
}

export default ProfileInfo;