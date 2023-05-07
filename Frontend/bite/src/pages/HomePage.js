import React, { useState, useEffect } from 'react';
import './HomePage.css';

const HomePage = () => {
  const userId = localStorage.getItem('userId');
  const idToken = localStorage.getItem('idToken');
  const [reviews, setReviews] = useState([]);
  const [updates, setUpdates] = useState({
    'NEW': [],
    'ONE WEEK AGO': [],
    'ONE MONTH AGO': [],
  });
  
  
  const apiUrl = process.env.REACT_APP_PUBLIC_URL || 'http://localhost:5000/';

  const updatesByTimeFrame = {
    'NEW': [],
    'ONE WEEK AGO': [],
    'ONE MONTH AGO': [],
  };

  async function fetchRestaurantName(restaurantId, idToken) {
    try {
      const response = await fetch(apiUrl + `api/restaurants/${restaurantId}`, {
        headers: {
          'Authorization': `Bearer ${idToken}`,
        },
      });
  
      if (response.ok) {
        const restaurant = await response.json();
        return restaurant.name;
      } else {
        throw new Error('Failed to fetch restaurant name');
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  }
  
  async function getUserFriends(userId, idToken) {
    try {
      const response = await fetch(apiUrl + `api/users/${userId}`, {
        headers: {
          'Authorization': `Bearer ${idToken}`,
        },
      });

      if (response.ok) {
        const user = await response.json();
        return user.friends;
      } else {
        throw new Error('Failed to fetch user friends');
      }
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async function getRecentRatings(friendId, timeFrames, idToken) {
    const response = await fetch(apiUrl + `api/users/${friendId}/ratings`, {
      headers: {
        'Authorization': `Bearer ${idToken}`,
      },
    });
  
    if (!response.ok) {
      throw new Error('Failed to fetch friend ratings');
    }
  
    const allRatings = await response.json();
    const recentRatings = {};
  
    for (const timeFrame of timeFrames) {
      const [minTimeFrame, maxTimeFrame, timeFrameLabel] = timeFrame;
  
      recentRatings[timeFrameLabel] = allRatings.filter((rating) => {
        const ratingDate = new Date(rating.created_at);
        const now = new Date();
        const diffTime = now - ratingDate;
        const diffDays = diffTime / (1000 * 60 * 60 * 24);
        return diffDays >= minTimeFrame && diffDays <= maxTimeFrame;
      });
    }
    return recentRatings;
  }
  
  
  async function getRecentListUpdates(friendId, timeFrames, idToken) {
    const response = await fetch(apiUrl + `api/users/${friendId}`, {
      headers: {
        'Authorization': `Bearer ${idToken}`,
      },
    });
  
    if (!response.ok) {
      throw new Error('Failed to fetch friend list updates');
    }
  
    const allLists = await response.json();
    const listTypes = ['haveBeenTo', 'wantsToTry', 'favorites'];
  
    const recentUpdates = {};
  
    for (const [minTimeFrame, maxTimeFrame] of timeFrames) {
      const timeFrameLabel = timeFrames.find(([min, max]) => min === minTimeFrame && max === maxTimeFrame)[2];
      recentUpdates[timeFrameLabel] = [];
  
      for (const listType of listTypes) {
        const updatedLists = await Promise.all(
          allLists[listType].map(async (restaurant) => {
            const updateDate = new Date(restaurant.timestamp);
            const now = new Date();
            const diffTime = now - updateDate;
            const diffDays = diffTime / (1000 * 60 * 60 * 24);
            const isWithinTimeFrame = diffDays >= minTimeFrame && diffDays <= maxTimeFrame;
            if (isWithinTimeFrame) {
              // Fetch the restaurant name here
              const restaurantName = await fetchRestaurantName(restaurant._id, idToken);
              return { ...restaurant, name: restaurantName };
            }
            return null;
          }),
        );
        
        const filteredUpdatedLists = updatedLists.filter(update => update);
        
        recentUpdates[timeFrameLabel].push(
          ...filteredUpdatedLists.map((update) => ({
            friendId,
            listType: listType,
            restaurant: update.name,
          })),
        );
      }
    }
    return recentUpdates;
  }
  
  
  
  
  useEffect(() => {
    (async () => {
      const friends = await getUserFriends(userId, idToken);
      if (friends.length === 0) {
        setUpdates(null);
        return;
      }
      const timeFrames = [
        [0, 1, 'NEW'],
        [1, 7, 'ONE WEEK AGO'],
        [7, 30, 'ONE MONTH AGO'],
      ];
      
      const allUpdatesByTimeFrame = {
        'NEW': [],
        'ONE WEEK AGO': [],
        'ONE MONTH AGO': [],
      };
  
      for (const friendId of friends) {
        const recentRatings = await getRecentRatings(friendId, timeFrames, idToken);
        const recentListUpdates = await getRecentListUpdates(friendId, timeFrames, idToken);
        // console.log(recentListUpdates);
        for (const timeFrameLabel in recentListUpdates) {
          allUpdatesByTimeFrame[timeFrameLabel].push(
            ...recentRatings[timeFrameLabel].map((rating) => ({
              type: 'review',
              friendId,
              timeFrame: timeFrameLabel,
              rating,
            })),
            ...recentListUpdates[timeFrameLabel].map((update) => ({
              type: 'listUpdate',
              friendId,
              timeFrame: timeFrameLabel,
              ...update,
            })),
          );
        }
      }
      console.log(allUpdatesByTimeFrame);
      setUpdates(allUpdatesByTimeFrame);
    })();
  }, []);
  
  
  
  return (
    <div className="home-page">
      <h1>Recent Friend Activity</h1>
      {updates === null && <p>No friends yet.</p>}
      <div className="updates-container">
      {Object.entries(updates).map(([timeFrameLabel, updatesInSection]) => (
          <div key={timeFrameLabel} className={`time-frame-section ${timeFrameLabel.replace(' ', '-').toLowerCase()}`}>
            <h2>{timeFrameLabel.toUpperCase()}</h2>
            {updatesInSection.map((update, index) => (
              <div key={index} className={`update-item ${update.type === 'review' ? 'review' : 'list-update'}`}>
                <p>Friend ID: {update.friendId}</p>
                {update.type === 'review' ? (
                  <>
                    <p>Rating: {update.rating.star_rating}</p>
                    <p>Review: {update.rating.review_content}</p>
                  </>
                ) : (
                  <>
                    <p>
                      {update.friendId} has added {update.restaurant} to their {update.listType} list.
                    </p>
                  </>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
