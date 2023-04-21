import React, { useState, useEffect } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "400px"
};

const defaultCenter = {
  lat: 40.730610,
  lng: -73.935242
};

function Map({ restaurants }) {
  const [map, setMap] = useState(null);

  useEffect(() => {
    // Fetch the restaurants data from your MongoDB collection here
  }, []);

  const onLoad = (mapInstance) => {
    setMap(mapInstance);
  };

  const renderMarkers = () => {
    return restaurants.map((restaurant) => (
      <Marker
        key={restaurant._id}
        position={{
          lat: restaurant.geometry.location.lat,
          lng: restaurant.geometry.location.lng
        }}
        label={restaurant.name}
      />
    ));
  };

  return (
    <LoadScript googleMapsApiKey="AIzaSyCpNT8X2EQ48kkPJEvAuLCWBYqPkyApfC0">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={defaultCenter}
        zoom={10}
        onLoad={onLoad}
      >
        {map && renderMarkers()}
      </GoogleMap>
    </LoadScript>
  );
}

export default Map;
