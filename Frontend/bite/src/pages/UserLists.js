import React from 'react';
import { Link } from 'react-router-dom';
import WantsToTryList from '../components/WantsToTryList';
import HaveBeenToList from '../components/HaveBeenToList';
import FavoritesList from '../components/FavoritesList';
import EditableLists from '../components/EditableLists';

const UserLists = () => {
  const userId = localStorage.getItem('userId');
  const idToken = localStorage.getItem('idToken');

  return (
    <div>
      <EditableLists userId={userId} idToken={idToken} />
    </div>
  );
};

export default UserLists;