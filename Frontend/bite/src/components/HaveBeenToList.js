import React, { useState, useEffect } from 'react';

const HaveBeenToList = ({ userId, idToken }) => {
  const [haveBeenToList, setHaveBeenToList] = useState([]);

  useEffect(() => {
    fetchHaveBeenToList(userId, idToken);
  }, [userId, idToken]);

  const apiUrl = process.env.REACT_APP_PUBLIC_URL || 'http://localhost:5000/';

  const fetchHaveBeenToList = async (userId, idToken) => {
    try {
      const response = await fetch(apiUrl + `/api/users/${userId}/have-been-to`, {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });
      const haveBeenTo = await response.json();
      setHaveBeenToList(haveBeenTo);
    } catch (error) {
      console.error('Error fetching have-been-to list:', error);
    }
  };

  return (
    <div>
      <h2>Have Been To</h2>
      <ul>
        {haveBeenToList.map((item) => (
          <li key={item._id}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default HaveBeenToList;
