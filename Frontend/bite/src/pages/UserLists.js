import React from 'react';
import WantsToTryList from '../components/WantsToTryList';
import HaveBeenToList from '../components/HaveBeenToList';
import FavoritesList from '../components/FavoritesList';

const UserLists = () => {
  const userId = localStorage.getItem('userId');
  const idToken = localStorage.getItem('idToken');

  return (
    <div>
      <WantsToTryList userId={userId} idToken={idToken} />
      <HaveBeenToList userId={userId} idToken={idToken} />
      <FavoritesList userId={userId} idToken={idToken} />
    </div>
  );
};

export default UserLists;
