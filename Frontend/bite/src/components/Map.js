import React, { useState } from "react";
import { GoogleMap, Marker, useLoadScript, InfoWindow } from "@react-google-maps/api";

const containerStyle = {
  width: "80%",
  height: "100vh",
};

const defaultCenter = {
  lat: 40.73061,
  lng: -73.935242,
};

function Map({ wantsToTry, haveBeenTo, favorites }) {
  const [map, setMap] = useState(null);
  const [showWantsToTry, setShowWantsToTry] = useState(true);
  const [showHaveBeenTo, setShowHaveBeenTo] = useState(true);
  const [showFavorites, setShowFavorites] = useState(true);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [toggles, setToggles] = useState({
    wantsToTry: true,
    haveBeenTo: true,
    favorites: true,
  });
  const { isLoaded, loadError } = useLoadScript({
  
    googleMapsApiKey: "AIzaSyCpNT8X2EQ48kkPJEvAuLCWBYqPkyApfC0",
    libraries: ["places"],
  });

  const onLoad = (mapInstance) => {
    setMap(mapInstance);
  };

  const renderListMarkers = (list, mapInstance, color) => {
    return list.map((restaurant) => (
      <Marker
        key={restaurant._id}
        position={{
          lat: restaurant.latitude,
          lng: restaurant.longitude,
        }}
        label={restaurant.name}
        map={mapInstance}
        icon={{
          url: `http://maps.google.com/mapfiles/ms/icons/${color}-dot.png`,
        }}
        onClick={() => setSelectedRestaurant(restaurant)}
      />
    ));
  };

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
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={defaultCenter}
        zoom={10}
        onLoad={onLoad}
      >
        {map && showWantsToTry && renderListMarkers(wantsToTry, map, "blue")}
        {map && showHaveBeenTo && renderListMarkers(haveBeenTo, map, "green")}
        {map && showFavorites && renderListMarkers(favorites, map, "red")}
        {selectedRestaurant && (
          <InfoWindow
            position={{
              lat: selectedRestaurant.latitude,
              lng: selectedRestaurant.longitude,
            }}
            onCloseClick={() => setSelectedRestaurant(null)}
          >
            <div>
              <h3>{selectedRestaurant.name}</h3>
              <p>Location:  {selectedRestaurant.location}</p>
              <p>Price Rating:  {selectedRestaurant.average_price_rating}</p>
              <p>User Rating:  {selectedRestaurant.average_user_rating}</p>
            </div>
          </InfoWindow>
        )}

      </GoogleMap>
    </div>
  );
}

export default Map;
