import React, { useState, useEffect } from 'react';
import './HomePage.css';
import { MdAccountCircle, MdStar, MdAttachMoney } from 'react-icons/md';

const HomePage = () => {
  const userId = localStorage.getItem('userId');
  const idToken = localStorage.getItem('idToken');
  const [reviews, setReviews] = useState([]);
  const [updates, setUpdates] = useState(null);
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  
  
  const apiUrl = process.env.REACT_APP_PUBLIC_URL || 'http://localhost:5000/';

  const updatesByTimeFrame = {
    'NEW': [],
    'ONE WEEK AGO': [],
    'ONE MONTH AGO': [],
  };

  async function fetchRestaurant(restaurantId, idToken) {
    try {
      const response = await fetch(apiUrl + `api/restaurants/${restaurantId}`, {
        headers: {
          'Authorization': `Bearer ${idToken}`,
        },
      });
  
      if (response.ok) {
        const restaurant = await response.json();
        return restaurant;
      } else if (response.status === 404) {
        console.warn(`Restaurant with ID ${restaurantId} not found.`);
        return {
          _id: restaurantId,
          name: 'Unknown Restaurant',
          location: 'Unknown Location',
        };
      } else {
        throw new Error('Failed to fetch restaurant');
      }
    } catch (error) {
      console.error(error);
      return {
        _id: restaurantId,
        name: 'Unknown Restaurant',
        location: 'Unknown Location',
      };
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
        return user.friends
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
        const updatedListsPromises = allLists[listType].map(async (restaurant) => {
          const updateDate = new Date(restaurant.timestamp);
          const now = new Date();
          const diffTime = now - updateDate;
          const diffDays = diffTime / (1000 * 60 * 60 * 24);
          const isWithinTimeFrame = diffDays >= minTimeFrame && diffDays <= maxTimeFrame;
          if (isWithinTimeFrame) {
            const restaurantObj = await fetchRestaurant(restaurant._id, idToken);
            return { ...restaurant, name: restaurantObj.name, location: restaurantObj.location };
          }
          return null;
        });
  
        const updatedLists = await Promise.all(updatedListsPromises);
        const filteredUpdatedLists = updatedLists.filter(update => update !== null && update.name !== 'Unknown Restaurant' && update.location !== 'Unknown Location');   
        console.log(filteredUpdatedLists)
        recentUpdates[timeFrameLabel].push(
          ...filteredUpdatedLists.map((update) => ({
            friendId,
            listType: listType,
            restaurant: update.name,
            location: update.location,
          })),
        );
      }
    }
    return recentUpdates;
  }
  
  
  
  
  
  useEffect(() => {
    (async () => {
      let fetchedFriendIds = await getUserFriends(userId, idToken);
      if (fetchedFriendIds.length === 0) {
        setUpdates([]);
        setLoading(false);
        return;
      }
  
      // Fetch friends' usernames
      const fetchedFriends = await Promise.all(
        fetchedFriendIds.map(async (friendId) => {
          const response = await fetch(apiUrl + `api/users/${friendId}`, {
            headers: {
              'Authorization': `Bearer ${idToken}`,
            },
          });
  
          if (response.ok) {
            const user = await response.json();
            return { id: friendId, username: user.username };
          } else {
            throw new Error(`Failed to fetch username for friend with ID ${friendId}`);
          }
        })
      );
      setFriends(fetchedFriends);
  
      // Calculate updates and set updates state
      const calculateUpdates = async (currentFriends) => {
        const timeFrames = [
          [0, 1, 'NEW'],
          [1, 7, 'THIS WEEK'],
          [7, 30, 'THIS MONTH'],
        ];
        
  
        const allUpdatesByTimeFrame = {
          'NEW': [],
          'THIS WEEK': [],
          'THIS MONTH': [],
        };
  
        for (const friend of currentFriends) {
          const friendId = friend.id;
          const username = friend.username;
          const recentRatings = await getRecentRatings(friendId, timeFrames, idToken);
          const recentListUpdates = await getRecentListUpdates(friendId, timeFrames, idToken);
          for (const timeFrameLabel in recentListUpdates) {
            const reviewUpdates = await Promise.all(
              recentRatings[timeFrameLabel].map(async (rating) => {
                const restaurant = await fetchRestaurant(rating.restaurant_id, idToken);
                return {
                  type: 'review',
                  friendId,
                  username,
                  timeFrame: timeFrameLabel,
                  rating: {
                    ...rating,
                    restaurant_name: restaurant.name,
                    restaurant_location: restaurant.location,
                    restaurant_price: restaurant.average_price_rating,
                    restaurant_rating: restaurant.average_user_rating,
                  },
                };
              }),
            );
            allUpdatesByTimeFrame[timeFrameLabel].push(...reviewUpdates);
          
            const listUpdates = recentListUpdates[timeFrameLabel].map((update) => ({
              type: 'list-update',
              listType: update.listType,
              friendId,
              username,
              timeFrame: timeFrameLabel,
              rating: {
                restaurant_name: update.restaurant,
                restaurant_location: update.location,
              },
            }));
            allUpdatesByTimeFrame[timeFrameLabel].push(...listUpdates);
            }          
          }
        console.log(allUpdatesByTimeFrame);
        setUpdates(allUpdatesByTimeFrame);
        setLoading(false);
      };
  
      calculateUpdates(fetchedFriends);
    })();
  }, [userId, idToken]);
  
  if (loading) {
    return <div className="loading-message">Loading...</div>;
}

if (updates.length === 0) {
    return <div className="no-updates-message">Add friends to see updates!</div>;
}

  
  return (
    <div className="home-page">
      <h1>Recent Friend Activity</h1>
      <div className="updates-container">
        {Object.entries(updates).map(([timeFrameLabel, updatesInSection]) => (
          <div key={timeFrameLabel} className={`time-frame-section ${timeFrameLabel.replace(' ', '-').toLowerCase()}`}>
            <h1 className = "title">{timeFrameLabel.toUpperCase()}</h1>
            {updatesInSection.map((update, index) => (
              <div key={index} className={`update-item ${update.type === 'review' ? 'review' : 'list-update'}`}>
                <div className="username-container">
                  <MdAccountCircle className="profile-icon" />
                  <p className="username">{update.username}</p>
                </div>
                {update.type === 'review' ? (
                    <>
                      <div className="update-content-reviews">
                        <div className="update-content-reviews-elements">
                          <h3 className="review-title">
                            {update.username} has rated {update.rating.restaurant_name} {' '} {update.rating.star_rating} stars out of 5 stars
                          </h3>
                          <h3 className="location-price">
                            {update.rating.restaurant_location} |{' '}
                            {[...Array(parseInt(update.rating.star_rating))].map((_, index) => (
                              <MdStar key={index} className="star-icon" />
                            ))}{' '}
                            |{' '}
                            {[...Array(parseInt(update.rating.price_level))].map((_, index) => (
                              <MdAttachMoney key={index} className="money-icon" />
                            ))}
                          </h3>
                          <h3 className="review-content">{update.rating.review_content}</h3>
                        </div>
                      </div>
                    </>
                  ) : (
                  <>
                  <div className="update-content-lists">
                      <p>
                        {update.username} has added {update.rating.restaurant_name} to their {update.listType} list.
                      </p>
                  </div>
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