import React, { useState, useEffect, useCallback} from "react";
import Select from 'react-select';
import {
  GoogleMap,
  Marker,
  useLoadScript,
  InfoWindow,
} from "@react-google-maps/api";

const containerStyle = {
  width: "80%",
  height: "100vh",
};

const defaultCenter = {
  lat: 40.73061,
  lng: -73.935242,
};

function Map({ wantsToTry, haveBeenTo, favorites }) {
  const userId = localStorage.getItem("userId");
  const idToken = localStorage.getItem("idToken");

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

  const onLoad = (mapInstance) => {
    setMap(mapInstance);
  };

  const fetchReviews = async (restaurantId) => {
    try {
      const requestOptions = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${idToken}`,
        },
      };

      const reviewsRes = await fetch(
        `/api/ratings/restaurant/${restaurantId}/reviews`,
        requestOptions
      );
      const reviewsData = await reviewsRes.json();
      setRestaurantReviews(reviewsData);
    } catch (error) {
      console.error("Error fetching reviews data:", error);
    }
  };

  const fetchFilteredRestaurants = useCallback(async (inputValue) => {
    try {
        const res = await fetch(`api/restaurants/search?q=${encodeURIComponent(inputValue)}`, {
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

  const handleSearchSelectChange = (selectedOption) => {
    setSelectedSearchResult({
      ...selectedOption,
      _id: selectedOption.value,
      name: selectedOption.label,
      latitude: selectedOption.geometry.location.lat,
      longitude: selectedOption.geometry.location.lng,
      location: selectedOption.location,
    });
    setShowSelectedSearchResult(true);
    setShowInfoWindow(true);
    if (map) {
      map.panTo(selectedOption.geometry.location);
      map.setZoom(15);
    }
  };
  
  
  

  const renderListMarkers = (list, mapInstance, color) => {
    return list.map((restaurant) => (
      <Marker
        key={restaurant._id}
        position={{
          lat: restaurant.latitude,
          lng: restaurant.longitude,
        }}
        title = ""
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
        fetchReviews(selectedSearchResult.value); // Assuming the restaurant ID is stored in the value property
      });

      return () => {
        marker.setMap(null);
      };
    }
  }, [selectedSearchResult, showSelectedSearchResult, map, fetchReviews]);

  if (loadError) {
    return <div>Error loading map</div>;
  }

  if (!isLoaded) {
    return <div>Loading map...</div>;
  }

  return (
    <div>
      <div className="map-toggle">
        <label>
          <input
            type="checkbox"
            checked={showWantsToTry}
            onChange={() => setShowWantsToTry(!showWantsToTry)}
          />{" "}
          Wants to Try
        </label>
        <label>
          <input
            type="checkbox"
            checked={showHaveBeenTo}
            onChange={() => setShowHaveBeenTo(!showHaveBeenTo)}
          />{" "}
          Have Been To
        </label>
        <label>
          <input
            type="checkbox"
            checked={showFavorites}
            onChange={() => setShowFavorites(!showFavorites)}
          />{" "}
          Favorites
        </label>
      </div>
      <div className="map-search">
        <Select
          value={selectedSearchResult}
          onInputChange={handleSearchInputChange}
          inputValue={searchInput}
          onChange={handleSearchSelectChange}
          options={searchResults}
          isClearable
          placeholder="Search for restaurants"
        />
      </div>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={defaultCenter}
        zoom={10}
        onLoad={onLoad}
      >
        {map && showWantsToTry && renderListMarkers(wantsToTry, map, "blue")}
        {map && showHaveBeenTo && renderListMarkers(haveBeenTo, map, "green")}
        {map && showFavorites && renderListMarkers(favorites, map, "red")}
        {showInfoWindow && selectedRestaurant && (
        <InfoWindow
          position={
            selectedRestaurant.geometry
              ? selectedRestaurant.geometry.location
              : {
                  lat: selectedRestaurant.latitude,
                  lng: selectedRestaurant.longitude,
                }
          }
          onCloseClick={() => {
            setSelectedRestaurant(null);
            setShowInfoWindow(true); // i think setting this to true always is better because its not intrusive at all
          }}
        >
          <div>
            <div>
              <h3>{selectedRestaurant.label || selectedRestaurant.name}</h3>
              <p>
                Location:{" "}
                {selectedRestaurant.location || "No location data available"}
              </p>
              <p>
                Price Rating:{" "}
                {selectedRestaurant.average_price_rating || "No price rating data"}
              </p>
              <p>
                User Rating:{" "}
                {selectedRestaurant.average_user_rating || "No user rating data"}
              </p>
            </div>
            <div>
              <h4>Reviews:</h4>
              {restaurantReviews.map((review) => (
                <div key={review._id}>
                  <p>User: {review.user_name}</p>
                  <p>Rating: {review.rating}</p>
                  <p>Comment: {review.comment}</p>
                  <hr />
                </div>
              ))}
            </div>
          </div>
        </InfoWindow>
      )}

      </GoogleMap>
    </div>
  );
}

export default Map;
