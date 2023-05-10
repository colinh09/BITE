import React from 'react';
import './ProfileNavbar.css';

function ProfileNavbar({ setTab }) {
  return (
    <div className="navbar">
      <button onClick={() => setTab('info')}>Profile Info</button>
      <button onClick={() => setTab('settings')}>Profile Settings</button>
      <button onClick={() => setTab('stats')}>Profile Stats</button>
    </div>
  );
}

export default ProfileNavbar;
