import React, { useState, useEffect, useCallback } from "react";
import { MdPerson, MdPersonAdd, MdOutlineClose, MdAccountCircle} from 'react-icons/md';
import Select from "react-select";
import styles from "../pages/MapPage.css";
import "./Map.css";
import ReviewForm from './ReviewForm';
import NotEditableLists from './NotEditableLists';
import InfoCard from './InfoCard';


import {
  GoogleMap,
  Marker,
  useLoadScript,
  InfoWindow,
} from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "100vh",
};

const defaultCenter = {
  lat: 40.73061,
  lng: -73.935242,
};

function Map({ wantsToTry, haveBeenTo, favorites }) {
  const userId = localStorage.getItem("userId");
  const idToken = localStorage.getItem("idToken");
  let debounceTimeoutId;
  const [map, setMap] = useState(null);
  const [showWantsToTry, setShowWantsToTry] = useState(true);
  const [showHaveBeenTo, setShowHaveBeenTo] = useState(true);
  const [showFavorites, setShowFavorites] = useState(true);
  const [restaurantReviews, setRestaurantReviews] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [searchInput, setSearchInput] = useState('');
  const [selectedSearchResult, setSelectedSearchResult] = useState(null);
  const [showSelectedSearchResult, setShowSelectedSearchResult] = useState(false);
  const [showInfoWindow, setShowInfoWindow] = useState(true);
  const [searchResults, setSearchResults] = useState([]);
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyCpNT8X2EQ48kkPJEvAuLCWBYqPkyApfC0",
    libraries: ["places"],
  });
  const [view, setView] = useState("map");
  const [friends, setFriends] = useState([]);
  const [searchFriends, setSearchFriends] = useState('');
  const [friendCode, setFriendCode] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [searchResultsFriends, setSearchResultsFriends] = useState([]);
  const [debouncedSearchFriends, setDebouncedSearchFriends] = useState('');
  const [displayedUserList, setDisplayedUserList] = useState(null);
  const [showNotEditableLists, setShowNotEditableLists] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const apiUrl = process.env.REACT_APP_PUBLIC_URL || 'http://localhost:5000/';

  const updateSearchResults = async () => {
    const searchResults = await searchUsers(searchFriends);
    setSearchResults(searchResults);
  };

  const refreshFriends = useCallback(async () => {
    try {
      const requestOptions = {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${idToken}`,
        },
      };
  
      const res = await fetch(apiUrl + `api/users/${userId}`, requestOptions);
      const userData = await res.json();
      console.log(userData);
      const friendsIds = userData.friends;
      
      const friendsDataPromises = friendsIds.map(async (friendId) => {
        const friendRes = await fetch(apiUrl + `api/users/${friendId}`, requestOptions);
        return friendRes.json();
      });
  
      const friendsData = await Promise.all(friendsDataPromises);
      setFriends(friendsData);
      updateSearchResults();
    } catch (error) {
      console.error("Error fetching friends data:", error);
    }
  }, [userId, idToken, searchFriends]);

  useEffect(() => {
    refreshFriends();
  }, [userId, idToken, view, refreshFriends]);

  useEffect(() => {
    async function fetchAndSetAllUsers() {
      const searchResults = await searchUsers("");
      setSearchResults(searchResults);
    }
  
    fetchAndSetAllUsers();
  }, []);

  const onLoad = (mapInstance) => {
    setMap(mapInstance);
  };

  const fetchReviews = useCallback(async (restaurantId) => {
    try {
      const requestOptions = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${idToken}`,
        },
      };
  
      const reviewsRes = await fetch(
        apiUrl + `api/ratings/restaurant/${restaurantId}/reviews`,
        requestOptions
      );
      const reviewsData = await reviewsRes.json();
      // console.log(reviewsData);
      setRestaurantReviews(reviewsData);
    } catch (error) {
      console.error("Error fetching reviews data:", error);
    }
  }, [idToken, apiUrl]);

  useEffect(() => {
    let marker;
  
    if (selectedSearchResult && map) {
      marker = new window.google.maps.Marker({
        position: selectedSearchResult.geometry.location,
        label: selectedSearchResult.label,
        map,
        icon: {
          url: `http://maps.google.com/mapfiles/ms/icons/yellow-dot.png`,
        },
      });
  
      marker.addListener("click", () => {
        setSelectedRestaurant(selectedSearchResult);
        setShowInfoWindow(true);
        fetchReviews(selectedSearchResult.value); 
      });
    }
  
    return () => {
      if (marker) {
        marker.setMap(null);
      }
    };
  }, [selectedSearchResult, map, fetchReviews]);
  

  const fetchFilteredRestaurants = useCallback(async (inputValue) => {
    try {
        const res = await fetch(apiUrl + `api/restaurants/search?q=${encodeURIComponent(inputValue)}`, {
            headers: {
            Authorization: `Bearer ${idToken}`,
            },
        });
        const responseData = await res.json();
        const restaurantData = responseData.data;

        if (Array.isArray(restaurantData)) {
          setSearchResults(
            restaurantData.map((restaurant) => ({
              value: restaurant._id,
              label: restaurant.name,
              geometry: {
                location: {
                  lat: restaurant.latitude,
                  lng: restaurant.longitude,
                },
              },
            })),
          );
        } else {
          console.error('Unexpected data format:', responseData);
          setSearchResults([]);
        }
    } catch (error) {
        console.error('Error fetching restaurants:', error);
    }
  }, [idToken]);

  const handleSearchInputChange = (inputValue) => {
      setSearchInput(inputValue);
  };

  const handleSearchSelectChange = async (selectedOption) => {
    try {
      const requestOptions = {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${idToken}`,
        },
      };
  
      const res = await fetch(apiUrl + `api/restaurants/${selectedOption.value}`, requestOptions);
      const fullRestaurantData = await res.json();
      setSelectedRestaurant(fullRestaurantData);
      fetchReviews(fullRestaurantData._id);
  
      setSelectedSearchResult({
        ...fullRestaurantData,
        value: selectedOption.value,
        label: selectedOption.label,
        geometry: {
          location: {
            lat: selectedOption.geometry.location.lat,
            lng: selectedOption.geometry.location.lng,
          },
        },
      });
      setShowSelectedSearchResult(true);
      setShowInfoWindow(true);
      if (map) {
        map.panTo(selectedOption.geometry.location);
        map.setZoom(15);
      }
    } catch (error) {
      console.error("Error fetching restaurant data:", error);
    }
  };
  
  
  const addFriend = async (friendCodeToAdd) => {
    try {
      const requestOptions = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${idToken}`,
        },
        body: JSON.stringify({ friendId: friendCodeToAdd }),
      };
  
      await fetch(apiUrl + `api/users/${userId}/friends/add`, requestOptions);
      setFriendCode('');
      refreshFriends(); 
    } catch (error) {
      console.error("Error adding friend:", error);
    }
  };

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      borderColor: state.isFocused ? '#F3684A' : '#F3684A',
      boxShadow: state.isFocused ? '0 0 0 1px #F3684A' : 'none',
      '&:hover': {
        borderColor: '#F3684A',
      },
      height: '63px',
      width: '380px',
      minHeight: '63px',
      padding: '5px',
    }),
    placeholder: (provided, state) => ({
      ...provided,
      color: '#F3684A',
      fontSize: '20px',
      fontWeight: '500',
      lineHeight: '29px',
    }),
  };

  const renderListMarkers = (list, mapInstance, color) => {
    if (!Array.isArray(list)) {
      console.error("Input to renderListMarkers is not an array:", list);
      return null;
    }
    return list.map((restaurant) => (
      <Marker
        key={restaurant._id}
        position={{
          lat: restaurant.latitude,
          lng: restaurant.longitude,
        }}
        title=""
        label={restaurant.name}
        map={mapInstance}
        icon={{
          url: `http://maps.google.com/mapfiles/ms/icons/${color}-dot.png`,
        }}
        onClick={() => {
          setSelectedRestaurant(restaurant);
          fetchReviews(restaurant._id);
          setShowInfoWindow(true);
        }}
      />
    ));
  };
  

  const handleButtonClick = (newView) => {
    setView(newView);
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
        if (searchInput) {
            fetchFilteredRestaurants(searchInput);
        }
      }, 300);
      return () => clearTimeout(timeoutId);
    }, [searchInput, fetchFilteredRestaurants]);

  useEffect(() => {
    if (selectedSearchResult) {
      const marker = new window.google.maps.Marker({
        position: selectedSearchResult.geometry.location,
        label: selectedSearchResult.label,
        map,
        icon: {
          url: `http://maps.google.com/mapfiles/ms/icons/yellow-dot.png`,
        },
      });

      marker.addListener("click", () => {
        setSelectedRestaurant(selectedSearchResult);
        console.log(selectedSearchResult.value);
        fetchReviews(selectedSearchResult.value);
      });

      return () => {
        marker.setMap(null);
      };
    }
  }, [selectedSearchResult, showSelectedSearchResult, map, fetchReviews]);

  useEffect(() => {
    if (debouncedSearchFriends) {
      searchUsers(debouncedSearchFriends);
    } else {
      setSearchResultsFriends([]);
    }
  }, [debouncedSearchFriends]);

  if (loadError) {
    return <div>Error loading map</div>;
  }

  if (!isLoaded) {
    return <div>Loading map...</div>;
  }

  const filteredFriends = friends ? friends.filter((friend) =>
    friend.username && friend.username.toLowerCase().includes(searchFriends.toLowerCase())
  ) : [];


  const renderMap = () => (
    <>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={defaultCenter}
        zoom={10}
        onLoad={onLoad}
      >
        {map && showWantsToTry && renderListMarkers(wantsToTry, map, "purple")}
        {map && showHaveBeenTo && renderListMarkers(haveBeenTo, map, "pink")}
        {map && showFavorites && renderListMarkers(favorites, map, "blue")}
      </GoogleMap>
      <div className="map-search">
        <Select
          value={selectedSearchResult}
          inputValue={searchInput}
          onInputChange={handleSearchInputChange}
          onChange={handleSearchSelectChange}
          options={searchResults}
          placeholder="Search for a restaurant...     "
          styles={customStyles}
        />
        {selectedRestaurant && showInfoWindow && (
          <InfoCard
            selectedRestaurant={selectedRestaurant}
            restaurantReviews={restaurantReviews}
            handleReviewFormToggle={handleReviewFormToggle}
            onReviewSubmit={onReviewSubmit}
            showReviewForm={showReviewForm}
            showInfoWindow={showInfoWindow}
            setShowInfoWindow={setShowInfoWindow}
          />
        )}
      </div>
      <div className="map-toggle">
      <label style={{color: 'purple'}}>
        <input
          type="checkbox"
          checked={showWantsToTry}
          onChange={() => setShowWantsToTry(!showWantsToTry)}
        />{" "}
        Wants to Try
      </label>
      <label style={{color: 'pink'}}>
        <input
          type="checkbox"
          checked={showHaveBeenTo}
          onChange={() => setShowHaveBeenTo(!showHaveBeenTo)}
        />{" "}
        Have Been To
      </label>
      <label style={{color: 'blue'}}>
        <input
          type="checkbox"
          checked={showFavorites}
          onChange={() => setShowFavorites(!showFavorites)}
        />{" "}
        Favorites
      </label>
      </div>
    </>
  );

  async function getUserData(userId) {
    try {
      const response = await fetch(apiUrl + `api/users/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${idToken}`,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const user = await response.json();
      return user;
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      return null;
    }
  }
  

  async function fetchAllUsers() {
    const response = await fetch(apiUrl + "api/users", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${idToken}`,
      },
    });
    const data = await response.json();
    const usernames = data.map((user) => user.username);
    return usernames;
  }
  
  function searchUsernames(usernames, query, loggedInUserId) {
    return usernames.filter(
      (username) =>
        username.userId !== loggedInUserId &&
        username.toLowerCase().includes(query.toLowerCase())
    );
  }
  

  function areFriends(loggedInUser, displayedUser) {
    const isFriend = loggedInUser.friends.some((friendId) => {
      return friendId === displayedUser._id;
    });
    return isFriend;
  }
  
  

async function searchUsers(query) {
  const usernames = await fetchAllUsers();
  const filteredUsernames = searchUsernames(usernames, query, userId);

  const searchResults = [];
  for (const username of filteredUsernames) {
    const userResponse = await fetch(apiUrl + `api/users/by-username/${username}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${idToken}`,
      },
    });
    const user = await userResponse.json();
    const loggedInUser = await getUserData(userId);
    console.log(loggedInUser);
    if (areFriends(loggedInUser, user)) {
      user.isFriend = true;
    } else {
      user.isFriend = false;
    }    
    searchResults.push(user);
  }
  return searchResults;
}

const removeFriend = async (friendIdToRemove) => {
  try {
    const requestOptions = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${idToken}`,
      },
      body: JSON.stringify({ friendId: friendIdToRemove }),
    };

    await fetch(apiUrl + `api/users/${userId}/friends/delete`, requestOptions);
    refreshFriends();
  } catch (error) {
    console.error("Error removing friend:", error);
  }
};

  
  
const renderFriends = () => (
  <div className="friends-container">
    {displayedUserList ? (
      <div className="modal-container">
        <div className="modal-content">
          <NotEditableLists
            userId={displayedUserList}
            idToken={idToken}
            onClose={() => setDisplayedUserList(null)}
          />
        </div>
      </div>
    ) : (
      <div>
        <h2 className="friends-title">Explore Friends!</h2>
        <div className="friends-inputs">
          <p className="paragraph">Search For Users</p>
          <input
            type="text"
            className="search-friends"
            value={searchFriends}
            onChange={(e) => {
              setSearchFriends(e.target.value);
              clearTimeout(debounceTimeoutId);
              debounceTimeoutId = setTimeout(async () => {
                const searchResults = await searchUsers(e.target.value);
                setSearchResults(searchResults);
              }, 300);
            }}
            placeholder="Type a username..."
          />
        </div>
        <ul className="user-list">
          {searchResults.map((user) => {
            return (
              <li key={user._id} className="user-item">
                <span className="user-info">
                  <MdAccountCircle
                    size={50}
                    color="#F3684A"
                    onClick={() => {
                      setDisplayedUserList(user._id);
                    }}
                    className = "user-icons-profile"
                  />
                  <span
                    className="username"
                    onClick={() => {
                      setDisplayedUserList(user._id);
                    }}
                  >
                    {user.username}
                  </span>
                </span>
                <span className="user-icons">
                  {user.isFriend ? (
                    <>
                      <MdPerson size={35} color="#F3684A" />
                      <button onClick={() => removeFriend(user._id)}>
                        <MdOutlineClose size={35} color="#F3684A" />
                      </button>
                    </>
                  ) : (
                    <button
                      className="add-friend-btn"
                      onClick={async () => {
                        setFriendCode(user._id);
                        console.log("FRIEND CODE FRIEND CODE:" + friendCode);
                        console.log("user id user id:" + user._id);
                        await addFriend(user._id);
                      }}
                    >
                      <MdPersonAdd size={35} color="#F3684A" />
                    </button>
                  )}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    )}
  </div>
);






  const fetchUsername = async (userId) => {
    const idToken = localStorage.getItem("idToken");
    try {
      const response = await fetch(apiUrl + "api/users/" + userId, {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });
  
      if (!response.ok) {
        throw new Error("Failed to fetch the user's information.");
      }
  
      const user = await response.json();
      return user.username;
    } catch (error) {
      console.error("Error fetching the user's information:", error);
      return null;
    }
  };  

  const onReviewSubmit = async (userId, restaurantId, reviewContent, starRating, priceLevel, repeatVisit, publicReview) => {
    const newRating = {
      user_id: userId,
      restaurant_id: restaurantId,
      review_content: reviewContent,
      star_rating: starRating,
      price_level: priceLevel,
      repeat_visit: repeatVisit,
      public_review: publicReview,
      username: fetchUsername(userId),
    };
    const idToken = localStorage.getItem("idToken");
    try {
      const response = await fetch(apiUrl + "api/ratings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify(newRating),
      });
  
      if (!response.ok) {
        throw new Error("Failed to submit the review.");
      }
      // Refresh the reviews for the current restaurant
      fetchReviews(selectedRestaurant._id);
    } catch (error) {
      console.error("Error submitting the review:", error);
    }
    setShowReviewForm(false);
  };
  const handleReviewFormToggle = () => {
    setShowReviewForm(!showReviewForm);
  };
  

  return (
    <div>
      <div className="button-container">
        <button
          onClick={() => handleButtonClick("map")}
          className={`button ${
            view === "map" ? "selected-button" : "unselected-button"
          }`}
        >
          Restaurant
        </button>
        <button
          onClick={() => handleButtonClick("friends")}
          className={`button ${
            view === "friends" ? "selected-button" : "unselected-button"
          }`}
        >
          Friends
        </button>
      </div>
      {view === "map" ? renderMap() : renderFriends()}
    </div>
  );
}

export default Map;