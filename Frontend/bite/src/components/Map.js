import React, { useState } from "react";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const defaultCenter = {
  lat: 40.73061,
  lng: -73.935242,
};

function Map({ restaurants }) {
  const [map, setMap] = useState(null);
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyCpNT8X2EQ48kkPJEvAuLCWBYqPkyApfC0",
    libraries: ["places"],
  });

  const onLoad = (mapInstance) => {
    setMap(mapInstance);
  };

  const renderMarkers = (mapInstance) => {
    console.log(restaurants);
    return restaurants.map((restaurant) => (
      <Marker
        key={restaurant._id}
        position={{
          lat: restaurant.latitude,
          lng: restaurant.longitude,
        }}
        label={restaurant.name}
        map={mapInstance}
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
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={defaultCenter}
      zoom={10}
      onLoad={onLoad}
    >
      {map && renderMarkers(map)}
    </GoogleMap>
  );
}

export default Map;
